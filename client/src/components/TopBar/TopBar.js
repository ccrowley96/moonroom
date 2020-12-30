import React from 'react';
import { useAuth } from '../../hooks/auth';
import { Link } from "react-router-dom";
import './TopBar.scss';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes, modalTypes } from '../../constants/constants';

const TopBar = () => {
    const {session: {user: {picture}}} = useAuth();
    const { appState: {activeCommunity}, appDispatch } = useAppState();
    return(
        <div className='topBar'>
            <div className='communityBurger navItem'>
                <div className='hamburgerWrapper' onClick={() => appDispatch({type: actionTypes.SET_ACTIVE_MODAL, payload: modalTypes.COMMUNITY_SELECTOR})}>
                    <div className='burger'></div>
                    <div className='burger'></div>
                    <div className='burger'></div>
                </div>
            </div>
            <div className='title navItem'>
            {
                activeCommunity ?
                    activeCommunity.name
                :   '<-- select community'

            }
            </div>
            <div className='profile navItem'>
                <Link className='imgWrapper' to={'/profile'}>
                    <img src={picture} className="userImg" alt='profile'/>
                </Link>
            </div>
        </div>
    )
}

export default TopBar;