import React, { useState } from 'react';
import Modal from '../../Modal';
import { useReactiveVar, useMutation, useQuery } from '@apollo/client';
import { activeRoomIdVar } from '../../../../cache';
import { DELETE_ROOM, GET_ACTIVE_ROOM , CREATE_ROOM} from '../../../../queries/room';
import { GET_ACTIVE_COMMUNITY } from '../../../../queries/community'
import { useAppState } from '../../../../hooks/provideAppState';
import { actionTypes } from '../../../../constants/constants';
import AreYouSure from '../AreYouSure/AreYouSure';
import MutationInput from '../../../MutationInput/MutationInput';
import './RoomDetailsModal.scss';

const RoomDetailsModal = ({ activeCommunity }) => {

    const activeRoomId = useReactiveVar(activeRoomIdVar)
    const { appDispatch } = useAppState();

    const [ deleteRoom ] = useMutation(DELETE_ROOM, {
        update(cache){
            const queryVars = { communityId: activeCommunity.id };
            
            // Read active community
            let activeCommunityData = cache.readQuery({
                query: GET_ACTIVE_COMMUNITY,
                variables: queryVars
            })

            // Write new community and filter out deleted room
            cache.writeQuery({
                query: GET_ACTIVE_COMMUNITY, 
                variables: queryVars,
                data: { 
                    community: {
                        ...activeCommunityData.community,
                        rooms: activeCommunityData.community.rooms.filter(room => room.id !== activeRoomId)
                    } 
                }
            })

            // Update reactive room ID var
            activeRoomIdVar(null);

            // Close modal
            appDispatch({type: actionTypes.SET_ACTIVE_MODAL, payload: null});
        },
    });

    const [ selectedRoom, setSelectedRoom ] = useState(activeRoomId ? activeRoomId : 'all')

    // Query active room using activeRoomId
    const {
        data: activeRoomData,
    } = useQuery(GET_ACTIVE_ROOM, {
        variables: {
            communityId: activeCommunity.id, 
            roomId: activeRoomId
        }, 
        skip: !activeRoomId
    })

   let room = activeRoomData?.room;
    
    return(
        <Modal title={room ? room.name : 'All'}>
            {
                room &&
                <div className='activeRoomDetails'>
                    <div className="modalSection">
                        <div className="sectionLabel">Created</div>
                        <div className="sectionValue">{new Date(Number(room.createdAt)).toDateString()}</div>
                    </div>
                </div>
            }
            <div className = 'selectCreateRoom'>
                { activeCommunity.rooms && activeCommunity.rooms.length > 0 &&
                    <div className="modalSection">
                        <div className="sectionLabel">Select room</div>
                        <div className="rooms">
                            <select className='_select' value={selectedRoom} onChange={(e) => {
                                let val = e.target.value;
                                setSelectedRoom(val);
                                activeRoomIdVar(val === 'all' ? null : val);
                            }}>
                                {/* Default option */}
                                <option key={'default'} value={'all'} onClick={() => {
                                        setSelectedRoom('all');
                                        activeRoomIdVar(null);
                                    }}>
                                        All
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
                    </div>
                }
                <div className="modalSection">
                    <MutationInput 
                        mutationType={CREATE_ROOM}
                        cacheUpdate={(cache, data) => {
                            
                            const queryVars = { communityId: activeCommunity.id };
                            
                            // Read active community
                            const activeCommunityData = cache.readQuery({
                                query: GET_ACTIVE_COMMUNITY,
                                variables: queryVars
                            })

                            // Overwrite cached query with new room added
                            cache.writeQuery({
                                query: GET_ACTIVE_COMMUNITY,
                                variables: queryVars,
                                data: {
                                    community: {
                                        ...activeCommunityData.community,
                                        rooms: [...activeCommunityData.community.rooms, data.data.addRoom.room]
                                    }
                                }
                            })
                        }}
                        dataTitle={'Create room'}
                        dataKey={'addRoom'}
                        maxLength={16}
                        placeholder={'Enter room name'}
                        inputVariable={'name'}
                        customVariables={[{communityId: activeCommunity.id}]}
                        refetchQueries={[{query: GET_ACTIVE_COMMUNITY, variables: {communityId: activeCommunity.id}}]}
                        onSuccess={(result) => {
                            let roomId = result.data.addRoom.room.id;
                            setSelectedRoom(roomId);
                            activeRoomIdVar(roomId);
                        }}
                    />
                </div>
            </div>
            { room &&
                <div className="modalSection">
                    <AreYouSure 
                        mutation={() => deleteRoom({variables: {communityId: activeCommunity.id, roomId: activeRoomId}})}
                        activeCommunity={activeCommunity}
                        successMessage={'Room deleted'}
                        failedMessage={'Room could not be deleted'}
                        buttonText={'Delete room'}
                        placeholder={'Enter room name to confirm'}
                        confirmText={room.name}
                        dangerText={<span>Deleting <b>{room.name}</b> cannot be undone.  All posts created in this room will <b>not</b> be deleted.  These posts will become uncategorized.</span>}
                    />
                </div>
            }
        </Modal>
    )
}

export default RoomDetailsModal;
