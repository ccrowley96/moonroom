import React, { useEffect, useRef } from 'react';
import Modal from '../../Modal';
import { useMutation } from '@apollo/client';
import { actionTypes } from '../../../../constants/constants';
import { useAppState } from '../../../../hooks/provideAppState';
import { DELETE_COMMUNITY } from '../../../../queries/community';
import AreYouSure from '../AreYouSure/AreYouSure';
import CommunityCodeLink from '../../../CommunityCodeLink/CommunityCodeLink';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import classNames from 'classnames/bind';
import { removeCommunityFromCache } from '../../../../services/utils';
const cx = classNames.bind(require('./CommunityDetailsModal.module.scss'));

const CommunityDetailsModal = ({ activeCommunity }) => {
    const { appDispatch } = useAppState();

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

    const targetRef = useRef();

    // Prevent scroll while open
    useEffect(() => {
        if (targetRef.current) {
            disableBodyScroll(targetRef.current, { reserveScrollBarGap: true });
        }
        return () => clearAllBodyScrollLocks();
    }, []);

    return (
        <Modal title={'Community: ' + activeCommunity.name}>
            <div className={cx('_modalSection')}>
                <CommunityCodeLink code={activeCommunity.code} />
            </div>
            {activeCommunity.members.length > 0 && (
                <>
                    <div className={cx('_sectionLabel')}>Members</div>
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
                </>
            )}
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Admins</div>
                {activeCommunity.admins.map((admin, idx) => {
                    return (
                        <div key={idx} className={cx('sectionValue')}>
                            {admin.name}
                        </div>
                    );
                })}
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Created</div>
                <div className={cx('_sectionValue')}>
                    {new Date(Number(activeCommunity.createdAt)).toDateString()}
                </div>
            </div>

            <AreYouSure
                mutation={() =>
                    deleteCommunity({
                        variables: { communityId: activeCommunity.id }
                    })
                }
                activeCommunity={activeCommunity}
                dataKey={'deleteCommunity'}
                successMessage={'Community deleted'}
                failedMessage={'Community could not be deleted'}
                buttonText={'Delete community'}
                placeholder={'Enter community name to confirm'}
                confirmText={activeCommunity.name}
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
