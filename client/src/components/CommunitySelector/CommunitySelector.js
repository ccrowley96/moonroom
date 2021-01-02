import React, { useEffect } from 'react';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes } from '../../constants/constants';
import { JOIN_COMMUNITY, CREATE_COMMUNITY, MY_COMMUNITIES } from '../../queries/community';
import MutationInput from '../MutationInput/MutationInput';
import { activeCommunityIdVar, activeRoomIdVar  } from '../../cache';

import './CommunitySelector.scss'

const CommunitySelector = ({refetchActiveCommunity, communities, activeCommunity}) => {
    const { appDispatch } = useAppState();

    // Refetch active community on mount (ensures that up to date rooms will be displayed)
    useEffect(() => {
        refetchActiveCommunity();
        // eslint-disable-next-line
    }, [])

    const selectCommunity = (communityId) => {
        localStorage.setItem('activeCommunityId', communityId)
        activeCommunityIdVar(communityId)
        activeRoomIdVar(null);
    }

    return (
        <div className='panelBlocker' onClick={(e) => appDispatch({type: actionTypes.SET_ACTIVE_MODAL, payload: null})}>
            <div className="communitySelector _base-slideRight" onClick={(e) => e.stopPropagation()}>
                {communities && communities.length > 0 &&
                    <>
                        { activeCommunity ? 
                            <div className="panelHeader">
                                <div className='activeCommunity'>
                                        <h3 className="communityName">Community: {activeCommunity.name}</h3>
                                        <p className="communityCode">Join code: {activeCommunity.code}</p>
                                </div>
                            </div>
                            : null
                        }

                    <div className='sectionLabel'>{activeCommunity ? 'My communities' : 'Select community'}</div>
                    {
                        communities.map((community, idx) => {
                            return(
                                <button className="communityOption _btn" key={idx} onClick={() => {
                                    selectCommunity(community.id);
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
                        onSuccess={(result) => selectCommunity(result.data.addCommunity.community.id)}
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
}

export default CommunitySelector
