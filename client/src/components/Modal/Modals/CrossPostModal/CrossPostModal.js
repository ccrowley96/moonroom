import React, { useState } from 'react';
import Modal from '../../Modal';
import { CROSS_POST } from '../../../../queries/post';

import classNames from 'classnames/bind';
import { useMutation } from '@apollo/client';
import { useAppState } from '../../../../hooks/provideAppState';
import { actionTypes } from '../../../../constants/constants';
const cx = classNames.bind(require('./CrossPostModal.module.scss'));

const CrossPostModal = ({ activeCommunity, communities }) => {
    const [selectedComunity, setSelectedCommunity] = useState('none');
    const [selectedRoom, setSelectedRoom] = useState('none');
    const [loading, setLoading] = useState(false);
    const { appState, appDispatch } = useAppState();
    const [crossPost] = useMutation(CROSS_POST);

    const submitCrossPost = async () => {
        try {
            setLoading(true);
            await crossPost({
                variables: {
                    postId: appState.modalData.id,
                    communityId: selectedComunity,
                    roomId: selectedRoom === 'none' ? null : selectedRoom
                }
            });
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
        appDispatch({
            type: actionTypes.SET_ACTIVE_MODAL,
            payload: null
        });
    };

    return (
        <Modal title="Cross post to another moon">
            <div className={cx('selectors')}>
                <div className={cx('selectMoon')}>
                    <div className={cx('selectLabel')}>Moon</div>
                    <div className={cx('_select-wrapper')}>
                        <select
                            className={cx('_select')}
                            onChange={(e) =>
                                setSelectedCommunity(e.target.value)
                            }
                            value={selectedComunity}
                        >
                            <option
                                key={'default'}
                                value={'none'}
                                disabled
                                hidden
                            >
                                Select moon
                            </option>
                            {communities
                                .filter((c) => {
                                    if (
                                        c.id ===
                                        appState.modalData.sourcePost?.community
                                            ?.id
                                    ) {
                                        return false;
                                    }

                                    // Post belongs to active community
                                    if (
                                        appState.modalData.community.id ===
                                        activeCommunity.id
                                    ) {
                                        return c.id !== activeCommunity.id;
                                    } else {
                                        return true;
                                    }
                                })
                                .map((c, idx) => {
                                    return (
                                        <option key={idx} value={c.id}>
                                            {c.name}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                </div>
                <div className={cx('selectRoom')}>
                    {selectedComunity !== 'none' && (
                        <>
                            <div className={cx('selectLabel')}>Room</div>
                            <div className={cx('_select-wrapper')}>
                                <select
                                    className={cx('_select')}
                                    onChange={(e) =>
                                        setSelectedRoom(e.target.value)
                                    }
                                    value={selectedRoom}
                                >
                                    <option key={'default'} value={'none'}>
                                        Uncategorized
                                    </option>
                                    {communities
                                        .find((c) => c.id === selectedComunity)
                                        .rooms.map((r, idx) => {
                                            return (
                                                <option key={idx} value={r.id}>
                                                    {r.name}
                                                </option>
                                            );
                                        })}
                                </select>
                            </div>
                        </>
                    )}
                </div>
                <div className={cx('btnWrapper')}>
                    <button
                        className={cx('_btn-success')}
                        onClick={() => submitCrossPost()}
                        disabled={selectedComunity === 'none' || loading}
                    >
                        Cross post
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CrossPostModal;
