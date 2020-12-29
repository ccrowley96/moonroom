import React from 'react';
import CommunitySelector from '../CommunitySelector/CommunitySelector';
import './Home.scss'

export default function Home(){
    return(
        <div>
            <h3 style={{textAlign: 'center'}}>Home page</h3>
            <CommunitySelector/>
        </div>
    );
}
