import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { MY_COMMUNITIES } from '../../queries/community'
import './CommunitySelector.scss'

export default function CommunitySelector(){

    const { loading: communitiesLoading, error: communitiesError, data: communitiesData } = useQuery(MY_COMMUNITIES,
        {
            fetchPolicy: 'cache-and-network',
        });

    if (communitiesLoading) return <p>Loading...</p>; 
    if (communitiesError) return <p>{communitiesError.message}</p>;

    if(communitiesData.myCommunities){
        let { myCommunities } = communitiesData;
        return (
            <div className="communitySelector">
                <h3>My communities</h3>
                {
                    myCommunities.map((community, idx) => {
                        return(
                            <div key={idx}>
                                {community.name} -- <i>{community.code}</i>
                            </div>
                        )
                    })
                }
            </div>
        );
    } else{
        return null;
    }
   
}
