import React from 'react';
import Modal from '../../Modal';
import { useReactiveVar } from '@apollo/client';
import { activeRoomVar } from '../../../../cache';

import './RoomDetailsModal.scss';

const RoomDetailsModal = () => {

    const activeRoom = useReactiveVar(activeRoomVar)
    
    return(
        <Modal title={activeRoom.name}>
            <div className="modalSection">
                <div className="sectionLabel"># of posts</div>
                <div className="sectionValue">{activeRoom.posts.length}</div>
            </div>
            <div className="modalSection">
                <div className="sectionLabel">Created</div>
                <div className="sectionValue">{new Date(Number(activeRoom.createdAt)).toDateString()}</div>
            </div>
        </Modal>
    )
}

export default RoomDetailsModal;
