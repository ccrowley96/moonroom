import React from 'react';
import CommunitySelector from '../CommunitySelector/CommunitySelector';
import { useQuery, useReactiveVar } from '@apollo/client';
import { MY_COMMUNITIES, GET_ACTIVE_COMMUNITY } from '../../queries/community'
import './Home.scss'
import { activeCommunityVar, activeCommunityIdVar, activeRoomIdVar } from '../../cache'
import { modalTypes } from '../../constants/constants';
import { useAppState } from '../../hooks/provideAppState';
import CommunityDetailsModal from '../Modal/Modals/CommunityDetailsModal/CommunityDetailsModal';
import RoomDetailsModal from '../Modal/Modals/RoomDetailsModal/RoomDetailsModal';

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
        errorPolicy: 'all',
        skip: !activeCommunityId, 
        // pollInterval: 5000,
        onCompleted: (data) => {
            console.log('completed active community refetch')
            activeCommunityVar(data.community)
        },
        fetchPolicy: 'cache-and-network'
    })

    return(
        <div className='homeWrapper'>
            {/* Render modals */}
            { activeModal === modalTypes.COMMUNITY_SELECTOR &&
                <CommunitySelector refetchActiveCommunity={() => activeCommunityId && refetchActiveCommunity()} communities={communitiesData?.myCommunities} activeCommunity={activeCommunityData?.community}/>
            }
            { activeModal === modalTypes.COMMUNITY_DETAILS &&
                <CommunityDetailsModal />
            }
            { activeModal === modalTypes.ROOM_DETAILS &&
                <RoomDetailsModal activeCommunity={activeCommunityData?.community} />
            }
        </div>
    );
}
