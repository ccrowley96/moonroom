import React, { useEffect } from 'react';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes, modalTypes } from '../../constants/constants';
import { JOIN_COMMUNITY, CREATE_COMMUNITY, MY_COMMUNITIES, GET_ACTIVE_COMMUNITY } from '../../queries/community';
import { CREATE_ROOM } from '../../queries/room';
import MutationInput from '../MutationInput/MutationInput';
import { activeCommunityIdVar, activeRoomIdVar } from '../../cache';

import './CommunitySelector.scss'

const CommunitySelector = ({communities, activeCommunity, activeRoom}) => {
    const { appState: { activeModal}, appDispatch } = useAppState();

    if(activeModal === modalTypes.COMMUNITY_SELECTOR){
        return (
            <div className='panelBlocker' onClick={(e) => appDispatch({type: actionTypes.SET_ACTIVE_MODAL, payload: null})}>
                <div className="communitySelector _base-slideRight" onClick={(e) => e.stopPropagation()}>
                    {communities && communities.length > 0 &&
                        <>
                            { activeCommunity ? 
                                <div className="panelHeader">
                                    <div className='activeCommunity'>
                                            <h3 className="communityName">Community: {activeCommunity.name}</h3>
                                            <p className="roomName">Room: {activeRoom ? activeRoom.name : null}</p>
                                            <p className="communityCode">Join code: {activeCommunity.code}</p>
                                            {   activeCommunity.rooms && activeCommunity.rooms.length > 0 &&
                                                <>
                                                    <h3>Rooms</h3>
                                                    <div className="rooms">
                                                        {
                                                            activeCommunity.rooms.map((room, idx) => {
                                                                return(
                                                                    <button className="room _btn" key={idx} onClick={() => activeRoomIdVar(room.id)}>
                                                                        {room.name}
                                                                    </button>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </>
                                            }
                                                
                                    </div>
                                    <div className="createRoomContainer">
                                        <MutationInput 
                                            mutationType={CREATE_ROOM}
                                            dataTitle={'Create room'}
                                            dataKey={'addRoom'}
                                            maxLength={16}
                                            placeholder={'Enter room name'}
                                            inputVariable={'name'}
                                            customVariables={[{communityId: activeCommunity.id}]}
                                            refetchQueries={[{query: GET_ACTIVE_COMMUNITY, variables: {communityId: activeCommunity.id}}]}
                                        />
                                    </div>
                                </div>
                                : null
                            }

                        <h3>{activeCommunity ? 'My communities' : 'Select community'}</h3>
                        {
                            communities.map((community, idx) => {
                                return(
                                    <button className="communityOption _btn" key={idx} onClick={() => {
                                        activeCommunityIdVar(community.id)
                                        activeRoomIdVar(null);
                                    }}>
                                        {community.name}
                                    </button>
                                )
                            })
                        }
                        </>
                    }
                    <div className="joinCreateContainer">
                        <MutationInput 
                            mutationType={CREATE_COMMUNITY}
                            dataTitle={'Create community'}
                            dataKey={'addCommunity'}
                            maxLength={16}
                            placeholder={'Enter community name'}
                            inputVariable={'name'}
                            refetchQueries={[{query: MY_COMMUNITIES}]}
                        />
                        <MutationInput 
                            mutationType={JOIN_COMMUNITY}
                            dataTitle={'Join community'}
                            dataKey={'joinCommunity'}
                            maxLength={8}
                            placeholder={'Enter community code'}
                            inputVariable={'code'}
                            refetchQueries={[{query: MY_COMMUNITIES}]}
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
