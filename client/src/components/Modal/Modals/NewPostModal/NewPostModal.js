import React, { useState } from 'react';
import Modal from '../../Modal';
import { activeRoomIdVar } from '../../../../cache';
import { useReactiveVar } from '@apollo/client';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./NewPostModal.module.scss'));


const NewPostModal = ({activeCommunity}) => {

    const noRoomSelected = 'Uncategorized';

    const activeRoomId = useReactiveVar(activeRoomIdVar)
    const [selectedRoom, setSelectedRoom] = useState(activeRoomId ? activeRoomId : noRoomSelected)

    return(
        <Modal title={`Posting to ${activeCommunity.name}`}>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Select room</div>
                    <select className={cx('_select')} value={selectedRoom} onChange={(e) => {
                        let val = e.target.value;
                        setSelectedRoom(val);
                        activeRoomIdVar(val === noRoomSelected ? null : val);
                    }}>
                        {/* Default option */}
                        <option key={'default'} value={noRoomSelected} onClick={() => {
                            setSelectedRoom(noRoomSelected);
                            activeRoomIdVar(null);
                        }}>
                            {noRoomSelected}
                        </option>
                        {
                            activeCommunity.rooms.map((room, idx) => {
                                return(
                                    <option key={idx} value={room.id} onClick={() => {
                                        setSelectedRoom(room.id);
                                        activeRoomIdVar(room.id);
                                    }}>
                                        {room.name}
                                    </option>
                                )
                            })
                        }
                    </select>

            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Title</div>
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Link</div>
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Body</div>
            </div>
        </Modal>
    )
}

export default NewPostModal;