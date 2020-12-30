import React from 'react';
import CommunitySelector from '../CommunitySelector/CommunitySelector';
import { useQuery } from '@apollo/client';
import { MY_COMMUNITIES } from '../../queries/community'
import './Home.scss'

export default function Home(){

    const { loading: communitiesLoading, error: communitiesError, data: communitiesData } = useQuery(MY_COMMUNITIES, { fetchPolicy: 'cache-and-network',});

    if (communitiesLoading) return <p>Loading...</p>; 
    if (communitiesError) return <p>{communitiesError.message}</p>;

    return(
        <div>
            <h3 style={{textAlign: 'center'}}>Home page</h3>
            <CommunitySelector communities={communitiesData.myCommunities}/>
        </div>
    );
}
