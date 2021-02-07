import React, { useEffect } from 'react';
import CommunitySelector from '../CommunitySelector/CommunitySelector';
import { useQuery, useReactiveVar } from '@apollo/client';
import { MY_COMMUNITIES, GET_ACTIVE_COMMUNITY } from '../../queries/community';
import { activeCommunityIdVar } from '../../cache';
import { actionTypes, modalTypes } from '../../constants/constants';
import { useAppState } from '../../hooks/provideAppState';
import CommunityDetailsModal from '../Modal/Modals/CommunityDetailsModal/CommunityDetailsModal';
import RoomDetailsModal from '../Modal/Modals/RoomDetailsModal/RoomDetailsModal';
import AddEditPostModal from '../Modal/Modals/AddEditPostModal/AddEditPostModal';
import PostsContainer from '../PostsContainer/PostsContainer';

import classNames from 'classnames/bind';
import CrossPostModal from '../Modal/Modals/CrossPostModal/CrossPostModal';
import { Link } from 'react-router-dom';
const cx = classNames.bind(require('./Home.module.scss'));

export default function Home() {
    // global app state
    const {
        appState: { activeModal },
        appDispatch
    } = useAppState();

    // Grab list of all communities
    const { data: communitiesData } = useQuery(MY_COMMUNITIES, {
        errorPolicy: 'all'
    });

    // Clear active modal on mount
    useEffect(() => {
        return () =>
            appDispatch({ type: actionTypes.SET_ACTIVE_MODAL, payload: null });
        // eslint-disable-next-line
    }, []);

    const activeCommunityId = useReactiveVar(activeCommunityIdVar);

    // Query active community using activeCommunityId
    const {
        data: activeCommunityData,
        refetch: refetchActiveCommunity
    } = useQuery(GET_ACTIVE_COMMUNITY, {
        variables: {
            communityId: activeCommunityId
        },
        errorPolicy: 'all',
        skip: !activeCommunityId
        // pollInterval: 10000
    });

    return (
        <div className={cx('homeWrapper')}>
            {/* Render modals */}
            {activeModal === modalTypes.COMMUNITY_SELECTOR && (
                <CommunitySelector
                    refetchActiveCommunity={() =>
                        activeCommunityId && refetchActiveCommunity()
                    }
                    communities={communitiesData?.myCommunities}
                    activeCommunity={activeCommunityData?.community}
                />
            )}
            {activeModal === modalTypes.COMMUNITY_DETAILS && (
                <CommunityDetailsModal
                    activeCommunity={activeCommunityData?.community}
                />
            )}
            {activeModal === modalTypes.ROOM_DETAILS && (
                <RoomDetailsModal
                    activeCommunity={activeCommunityData?.community}
                />
            )}
            {activeModal === modalTypes.NEW_POST && (
                <AddEditPostModal
                    activeCommunity={activeCommunityData?.community}
                />
            )}
            {activeModal === modalTypes.CROSSPOST && (
                <CrossPostModal
                    communities={communitiesData?.myCommunities}
                    activeCommunity={activeCommunityData?.community}
                />
            )}
            {/* Render posts */}
            {activeCommunityData?.community && (
                <PostsContainer
                    activeCommunity={activeCommunityData?.community}
                />
            )}
            {!activeCommunityId && (
                <div className={cx('welcomeToTheMoon')}>
                    <div className={cx('welcomeText')}>
                        Welcome to the moon &#128640;
                    </div>
                    <div className={cx('welcomeText')}>
                        <Link
                            className={cx('welcomeText', 'tutorialLink')}
                            to={'/profile'}
                        >
                            Astronautics 101
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
