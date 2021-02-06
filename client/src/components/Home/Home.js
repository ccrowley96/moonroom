import React from 'react';
import CommunitySelector from '../CommunitySelector/CommunitySelector';
import { useQuery, useReactiveVar } from '@apollo/client';
import { MY_COMMUNITIES, GET_ACTIVE_COMMUNITY } from '../../queries/community';
import { activeCommunityIdVar } from '../../cache';
import { modalTypes } from '../../constants/constants';
import { useAppState } from '../../hooks/provideAppState';
import CommunityDetailsModal from '../Modal/Modals/CommunityDetailsModal/CommunityDetailsModal';
import RoomDetailsModal from '../Modal/Modals/RoomDetailsModal/RoomDetailsModal';
import AddEditPostModal from '../Modal/Modals/AddEditPostModal/AddEditPostModal';
import PostsContainer from '../PostsContainer/PostsContainer';

import classNames from 'classnames/bind';
import CrossPostModal from '../Modal/Modals/CrossPostModal/CrossPostModal';
const cx = classNames.bind(require('./Home.module.scss'));

export default function Home() {
    // global app state
    const {
        appState: { activeModal }
    } = useAppState();

    // Grab list of all communities
    const { data: communitiesData } = useQuery(MY_COMMUNITIES, {
        errorPolicy: 'all'
    });

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
        </div>
    );
}
