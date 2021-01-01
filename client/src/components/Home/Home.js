import React from 'react';
import CommunitySelector from '../CommunitySelector/CommunitySelector';
import { useQuery, useReactiveVar } from '@apollo/client';
import { MY_COMMUNITIES, GET_ACTIVE_COMMUNITY } from '../../queries/community'
import './Home.scss'
import { GET_ACTIVE_ROOM } from '../../queries/room';
import {activeCommunityVar, activeRoomVar, activeCommunityIdVar, activeRoomIdVar} from '../../cache'
import { modalTypes } from '../../constants/constants';
import { useAppState } from '../../hooks/provideAppState';
import CommunityDetailsModal from '../Modal/Modals/CommunityDetailsModal/CommunityDetailsModal';
import RoomDetailsModal from '../Modal/Modals/RoomDetailsModal.js/RoomDetailsModal';

export default function Home(){
    
    // global app state
    const { appState: { activeModal} } = useAppState();

    // Grab list of all communities
    const { 
        data: communitiesData
    } = useQuery(MY_COMMUNITIES, {notifyOnNetworkStatusChange: true, fetchPolicy: 'cache-and-network'});


    const activeCommunityId = useReactiveVar(activeCommunityIdVar)
    const activeRoomId = useReactiveVar(activeRoomIdVar)

    // Query active community using activeCommunityId
    const {
        data: activeCommunityData,
        refetch: refetchActiveCommunity
    } = useQuery(GET_ACTIVE_COMMUNITY, {
        variables: {
            communityId: activeCommunityId
        }, 
        skip: !activeCommunityId, 
        pollInterval: 10000,
        onCompleted: (data) => activeCommunityVar(data.community)
    })

    // Query active room using activeRoomId and poll for changes every 500 ms
    const {
        data: activeRoomData,
    } = useQuery(GET_ACTIVE_ROOM, {
        variables: {
            communityId: activeCommunityId, 
            roomId: activeRoomId
        }, 
        skip: !activeRoomId,
        onCompleted: (data) => activeRoomVar(data.room),
        // pollInterval: 2000 // Poll for changes every x msecs
    })

    return(
        <div className='homeWrapper'>
            {/* Render modals */}
            { activeModal === modalTypes.COMMUNITY_SELECTOR &&
                <CommunitySelector refetchActiveCommunity={() => activeCommunityId && refetchActiveCommunity()} communities={communitiesData?.myCommunities} activeCommunity={activeCommunityData?.community} activeRoom={activeRoomData?.room}/>
            }
            { activeModal === modalTypes.COMMUNITY_DETAILS &&
                <CommunityDetailsModal />
            }
            { activeModal === modalTypes.ROOM_DETAILS &&
                <RoomDetailsModal />
            }
        </div>
    );
}
