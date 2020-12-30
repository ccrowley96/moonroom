import React from 'react';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes, modalTypes } from '../../constants/constants';
import { JOIN_COMMUNITY, CREATE_COMMUNITY } from '../../queries/community';
import { CREATE_ROOM } from '../../queries/room';
import MutationInput from '../MutationInput/MutationInput';

import './CommunitySelector.scss'

const CommunitySelector = ({communities, refetch}) => {
    const { appState: { activeModal, activeCommunity: activeCommunityId, activeRoom: activeRoomId}, appDispatch } = useAppState();

    // Populate active community & room with latest graph ql queried data
    let activeCommunity = null, activeRoom = null;
    if(activeCommunityId && communities)
        activeCommunity = communities.find(community => community.id === activeCommunityId)
    
    if(activeCommunity && activeCommunity.rooms && activeRoomId)
        activeRoom = activeCommunity.rooms.find(room => room.id === activeRoomId);

    if(activeModal === modalTypes.COMMUNITY_SELECTOR){
        return (
            <div className='panelBlocker' onClick={(e) => appDispatch({type: actionTypes.SET_ACTIVE_MODAL, payload: null})}>
                <div className="communitySelector _base-slideRight" onClick={(e) => e.stopPropagation()}>
                    {communities && communities.length > 0 &&
                        <>
                            { activeCommunity ? 
                                <div className="panelHeader">
                                    <div className='activeCommunity'>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td><h3 className="communityName">{activeCommunity.name} {activeRoom ? ` | ${activeRoom.name}`: null}</h3></td>
                                                </tr>
                                                
                                                <tr>
                                                    <td><p className="communityCode">Join code: {activeCommunity.code}</p></td>
                                                </tr>
                                                {
                                                    activeCommunity.rooms && activeCommunity.rooms.length > 0 &&
                                                    <tr>
                                                        <h3>Rooms</h3>
                                                        {
                                                            activeCommunity.rooms.map((room, idx) => {
                                                                return(
                                                                    <button className="room _btn" key={idx} onClick={() => appDispatch({type: actionTypes.SET_ACTIVE_ROOM, payload: room.id})}>
                                                                        {room.name}
                                                                    </button>
                                                                )
                                                            })
                                                        }
                                                    </tr>
                                                }
                                                
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="createRoomContainer">
                                        <MutationInput 
                                            refetch={refetch}
                                            mutationType={CREATE_ROOM}
                                            dataTitle={'Create room'}
                                            dataKey={'addRoom'}
                                            maxLength={16}
                                            placeholder={'Enter room name'}
                                            inputVariable={'name'}
                                            customVariables={[{communityId: activeCommunity.id}]}
                                        />
                                    </div>
                                </div>
                                : null
                            }

                        <h3>{activeCommunity ? 'My communities' : 'Select community'}</h3>
                        {
                            communities.map((community, idx) => {
                                return(
                                    <button className="communityOption _btn" key={idx} onClick={() => appDispatch({type: actionTypes.SET_ACTIVE_COMMUNITY, payload: community.id})}>
                                        {community.name}
                                    </button>
                                )
                            })
                        }
                        </>
                    }
                    <div className="joinCreateContainer">
                        <MutationInput 
                            refetch={refetch}
                            mutationType={CREATE_COMMUNITY}
                            dataTitle={'Create community'}
                            dataKey={'addCommunity'}
                            maxLength={16}
                            placeholder={'Enter community name'}
                            inputVariable={'name'}
                        />
                        <MutationInput 
                            refetch={refetch}
                            mutationType={JOIN_COMMUNITY}
                            dataTitle={'Join community'}
                            dataKey={'joinCommunity'}
                            maxLength={8}
                            placeholder={'Enter community code'}
                            inputVariable={'code'}
                        />
                    </div>
                </div>
            </div>
        );
       
    } else {
        return null;
    }
}

export default CommunitySelector
