import React from 'react';
import CommunitySelector from '../CommunitySelector/CommunitySelector';
import { useQuery, NetworkStatus } from '@apollo/client';
import { MY_COMMUNITIES } from '../../queries/community'
import './Home.scss'

export default function Home(){

    const { 
        loading: communitiesLoading, 
        error: communitiesError, 
        data: communitiesData, 
        refetch,
        networkStatus
    } = useQuery(MY_COMMUNITIES, {notifyOnNetworkStatusChange: true, fetchPolicy: 'cache-and-network'});


    // if (networkStatus === NetworkStatus.refetch) return <p>Fetching new data</p>;
    // if (communitiesLoading) return null; 
    // if (communitiesError) return <p>{communitiesError.message}</p>;

    return(
        <div>
            <CommunitySelector communities={communitiesData?.myCommunities} refetch={() => refetch()}/>
        </div>
    );
}
