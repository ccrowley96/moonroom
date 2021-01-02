import React from 'react';
import { useAuth } from '../../hooks/auth';
import { Link } from "react-router-dom";
import { useReactiveVar } from '@apollo/client';
import './TopBar.scss';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes, modalTypes } from '../../constants/constants';
import { activeCommunityVar, activeRoomIdVar} from '../../cache';

const TopBar = () => {
    const {session: {user: {picture}}} = useAuth();
    const { appDispatch } = useAppState();

    const activeCommunity = useReactiveVar(activeCommunityVar);
    const activeRoomId = useReactiveVar(activeRoomIdVar);

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
                    activeCommunity && 
                    <>
                        <div className='communityName' onClick={() => appDispatch({type: actionTypes.SET_ACTIVE_MODAL, payload: modalTypes.COMMUNITY_DETAILS})}>
                            {activeCommunity.name}
                        </div>
                        <div className='roomNameBtn' onClick={() => appDispatch({type: actionTypes.SET_ACTIVE_MODAL, payload: modalTypes.ROOM_DETAILS})}>
                            {activeRoomId ? activeCommunity.rooms.find(room => room.id === activeRoomId).name : 'All'}
                        </div>
                    </>
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