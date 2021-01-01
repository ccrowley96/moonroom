import React from 'react';
import Modal from '../../Modal';
import { useReactiveVar, useMutation } from '@apollo/client';
import { activeCommunityVar } from '../../../../cache';
import { activeRoomVar } from '../../../../cache';
import { DELETE_ROOM } from '../../../../queries/room';
import AreYouSure from '../AreYouSure/AreYouSure';

import './RoomDetailsModal.scss';

const RoomDetailsModal = () => {

    const activeCommunity = useReactiveVar(activeCommunityVar)
    const activeRoom = useReactiveVar(activeRoomVar)
    const [ deleteRoom ] = useMutation(DELETE_ROOM);
    
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
            <AreYouSure 
                mutation={() => deleteRoom({variables: {communityId: activeCommunity.id, roomId: activeRoom.id}})}
                dataKey={'deleteRoom'}
                successMessage={'Room deleted'}
                failedMessage={'Room could not be deleted'}
                buttonText={'Delete room'}
                placeholder={'Enter room name to confirm'}
                confirmText={activeRoom.name}
                dangerText={<span>Deleting <b>{activeRoom.name}</b> will also delete all posts created within <b>{activeRoom.name}</b>.  This cannot be undone.</span>}
            />
        </Modal>
    )
}

export default RoomDetailsModal;
