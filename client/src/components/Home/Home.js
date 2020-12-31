import React from 'react';
import CommunitySelector from '../CommunitySelector/CommunitySelector';
import { useQuery, NetworkStatus } from '@apollo/client';
import { MY_COMMUNITIES, GET_ACTIVE_COMMUNITY, GET_ACTIVE_COMMUNITY_ID_CLIENT } from '../../queries/community'
import './Home.scss'
import { GET_ACTIVE_ROOM, GET_ACTIVE_ROOM_ID_CLIENT } from '../../queries/room';
import {activeCommunity, activeRoom} from '../../cache'

export default function Home(){

    // Grab list of all communities
    const { 
        loading: communitiesLoading, 
        error: communitiesError, 
        data: communitiesData, 
        networkStatus
    } = useQuery(MY_COMMUNITIES, {notifyOnNetworkStatusChange: true, fetchPolicy: 'cache-and-network'});

    // Get active communityId
    const {
        data: {activeCommunityId: activeCommunityId}
    } = useQuery(GET_ACTIVE_COMMUNITY_ID_CLIENT)

    // Get active roomId
    const {
        data: {activeRoomId: activeRoomId}
    } = useQuery(GET_ACTIVE_ROOM_ID_CLIENT)

    // Query active community using activeCommunityIdVar
    const {
        data: activeCommunityData
    } = useQuery(GET_ACTIVE_COMMUNITY, {
        variables: {
            communityId: activeCommunityId
        }, 
        skip: !activeCommunityId, 
        onCompleted: (data) => activeCommunity(data.community)
    })

    // Query active room using activeRoomIdVar and poll for changes every 500 ms
    const {
        data: activeRoomData,
    } = useQuery(GET_ACTIVE_ROOM, {
        variables: {
            communityId: activeCommunityId, 
            roomId: activeRoomId
        }, 
        skip: !activeRoomId,
        onCompleted: (data) => activeRoom(data.room),
        // pollInterval: 2000 // Poll for changes every x msecs
    })

    return(
        <div>
            <CommunitySelector communities={communitiesData?.myCommunities} activeCommunity={activeCommunityData?.community} activeRoom={activeRoomData?.room}/>
        </div>
    );
}
