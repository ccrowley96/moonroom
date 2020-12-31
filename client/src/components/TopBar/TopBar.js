import React from 'react';
import { useAuth } from '../../hooks/auth';
import { Link } from "react-router-dom";
import { useQuery } from '@apollo/client';
import './TopBar.scss';
import { useAppState } from '../../hooks/provideAppState';
import { GET_ACTIVE_COMMUNITY_CLIENT } from '../../queries/community';
import { GET_ACTIVE_ROOM_CLIENT } from '../../queries/room';
import { actionTypes, modalTypes } from '../../constants/constants';

const TopBar = () => {
    const {session: {user: {picture}}} = useAuth();
    const { appDispatch } = useAppState();

    const {
        data: {activeCommunity: activeCommunity}
    } = useQuery(GET_ACTIVE_COMMUNITY_CLIENT)

    const {
        data: {activeRoom: activeRoom}
    } = useQuery(GET_ACTIVE_ROOM_CLIENT)

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
                <div className='communityName'>
                    {activeCommunity && activeCommunity.name}
                </div>
                <div className='roomName'>
                    {activeRoom && `| ${activeRoom.name}`}
                </div>
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