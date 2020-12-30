import React from 'react';
import './CommunitySelector.scss'

export default function CommunitySelector({communities}){
    if(communities){
        return (
            <div className="communitySelector">
                <h3>My communities</h3>
                {
                    communities.map((community, idx) => {
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
