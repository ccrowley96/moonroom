import React from 'react';
import { useAuth } from '../../hooks/auth';
import { Link } from "react-router-dom";
import './TopBar.scss';

const TopBar = () => {
    const {session: {user: {picture}}} = useAuth();
    return(
        <div className='topBar'>
            <div className='communityBurger navItem'>
                <div className='hamburgerWrapper'>
                    <div className='burger'></div>
                    <div className='burger'></div>
                    <div className='burger'></div>
                </div>
            </div>
            <div className='title navItem'>Test community | Test room</div>
            <div className='profile navItem'>
                <Link className='imgWrapper' to={'/profile'}>
                    <img src={picture} className="userImg" alt='profile'/>
                </Link>
            </div>
        </div>
    )
}

export default TopBar;