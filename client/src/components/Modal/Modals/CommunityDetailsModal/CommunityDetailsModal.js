import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../Modal';
import { useMutation, useQuery } from '@apollo/client';
import { actionTypes } from '../../../../constants/constants';
import { useAppState } from '../../../../hooks/provideAppState';
import {
    DELETE_COMMUNITY,
    LEAVE_COMMUNITY
} from '../../../../queries/community';
import AreYouSure from '../AreYouSure/AreYouSure';
import CommunityCodeLink from '../../../CommunityCodeLink/CommunityCodeLink';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import classNames from 'classnames/bind';
import { removeCommunityFromCache } from '../../../../services/utils';
import { USER_QUERY } from '../../../../queries/profile';
const cx = classNames.bind(require('./CommunityDetailsModal.module.scss'));

const CommunityDetailsModal = ({ activeCommunity }) => {
    const { appDispatch } = useAppState();
    const { data: userData } = useQuery(USER_QUERY);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [deleteCommunity] = useMutation(DELETE_COMMUNITY, {
        update(cache) {
            const communityId = activeCommunity.id;
            removeCommunityFromCache(communityId);

            cache.modify({
                fields: {
                    feed: (_, { DELETE }) => {
                        return DELETE;
                    }
                }
            });

            // Close modal
            appDispatch({ type: actionTypes.SET_ACTIVE_MODAL, payload: null });
        }
    });

    const [leaveCommunity] = useMutation(LEAVE_COMMUNITY, {
        update(cache) {
            const communityId = activeCommunity.id;
            removeCommunityFromCache(communityId);

            cache.modify({
                fields: {
                    feed: (_, { DELETE }) => {
                        return DELETE;
                    }
                }
            });

            // Close modal
            appDispatch({ type: actionTypes.SET_ACTIVE_MODAL, payload: null });
        }
    });

    const targetRef = useRef();

    // Prevent scroll while open
    useEffect(() => {
        if (targetRef.current) {
            disableBodyScroll(targetRef.current, { reserveScrollBarGap: true });
        }
        return () => clearAllBodyScrollLocks();
    }, []);

    return (
        <Modal
            title={'Moon: ' + activeCommunity.name}
            isConfirmOpen={isConfirmOpen}
            setIsConfirmOpen={setIsConfirmOpen}
            onConfirmed={() => {
                leaveCommunity({
                    variables: { communityId: activeCommunity.id }
                });
            }}
        >
            <div className={cx('_modalSection')}>
                <CommunityCodeLink code={activeCommunity.code} />
            </div>
            {activeCommunity.members.length > 0 && (
                <div className={cx('membersWrapper')}>
                    <div className={cx('_sectionLabel')}>Astronauts</div>
                    <div
                        className={cx('_modalSection', 'memberList')}
                        ref={targetRef}
                    >
                        {activeCommunity.members.map((member, idx) => {
                            return (
                                <div key={idx} className={cx('sectionValue')}>
                                    {member.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Mission commander</div>
                {activeCommunity.admins.map((admin, idx) => {
                    return (
                        <div key={idx} className={cx('sectionValue')}>
                            {admin.name}
                        </div>
                    );
                })}
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Moon formation date</div>
                <div className={cx('_sectionValue')}>
                    {new Date(Number(activeCommunity.createdAt)).toDateString()}
                </div>
            </div>

            {userData &&
                userData.me &&
                activeCommunity.members.find(
                    (member) => member.id === userData.me.id
                ) && (
                    <div className={cx('leaveCommunityWrapper')}>
                        <button
                            className={cx('_btn-danger')}
                            onClick={() => setIsConfirmOpen(true)}
                        >
                            Leave community
                        </button>
                    </div>
                )}
            <AreYouSure
                mutation={async () =>
                    await deleteCommunity({
                        variables: { communityId: activeCommunity.id }
                    })
                }
                activeCommunity={activeCommunity}
                dataKey={'deleteCommunity'}
                successMessage={'Moon deleted'}
                failedMessage={'Moon could not be deleted'}
                buttonText={'Delete moon'}
                placeholder={'Enter moon name to confirm'}
                confirmText={activeCommunity.name}
                titleText={'Moon detonator'}
                dangerText={
                    <span>
                        Deleting <b>{activeCommunity.name}</b> will also delete
                        all rooms and posts created within{' '}
                        <b>{activeCommunity.name}</b>. This cannot be undone.
                    </span>
                }
            />
        </Modal>
    );
};

export default CommunityDetailsModal;
