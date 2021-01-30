import React, { useEffect, useState } from 'react';
import PostPreview from '../PostPreview/PostPreview';
import Search from '../Search/Search';
import { FEED_QUERY, FEED_SEARCH } from '../../queries/post';
import { useApolloClient, useQuery, useReactiveVar } from '@apollo/client';
import { activeCommunityIdVar, activeRoomIdVar } from '../../cache';
import CommunityCodeLink from '../CommunityCodeLink/CommunityCodeLink';
import { Waypoint } from 'react-waypoint';
import { FiShare } from 'react-icons/fi';

import classNames from 'classnames/bind';
import {
    getFeedQueryVariables,
    getFeedSearchVariables
} from '../../services/utils';
import { useDidUpdateEffect } from '../../hooks/misc';
import { useAppState } from '../../hooks/provideAppState';
import RoomSelectorList from '../RoomSelectorList/RoomSelectorList';
import { actionTypes } from '../../constants/constants';
const cx = classNames.bind(require('./PostsContainer.module.scss'));

const PostsContainer = ({ activeCommunity }) => {
    const [searchFilter, setSearchFilter] = useState('');
    const activeCommunityId = useReactiveVar(activeCommunityIdVar);
    const activeRoomId = useReactiveVar(activeRoomIdVar);
    const { appState, appDispatch } = useAppState();
    const client = useApolloClient();
    const triggerRefresh = appState.triggerRefresh;

    const { loading, data, fetchMore } = useQuery(FEED_QUERY, {
        variables: getFeedQueryVariables(activeCommunityId, activeRoomId)
    });

    const fetchMoreNoCursor = async (fromRefresh = false) => {
        await fetchMore({
            variables: getFeedQueryVariables(activeCommunityId, activeRoomId)
        });
        if (fromRefresh)
            appDispatch({ type: actionTypes.TRIGGER_REFRESH, payload: false });
    };

    // Re-fetch on room change
    useDidUpdateEffect(() => {
        if (fetchMore) fetchMoreNoCursor();
    }, [activeRoomId]);

    // Re-fetch on refresh trigger
    useDidUpdateEffect(() => {
        if (appState.triggerRefresh) {
            if (appState.searchActive) {
                feedSearch(null, true);
            } else {
                fetchMoreNoCursor(true);
            }
        }
    }, [triggerRefresh]);

    // Re-fetch on community change
    useEffect(() => {
        fetchMoreNoCursor();
        setSearchFilter('');
        // eslint-disable-next-line
    }, [activeCommunityId]);

    const feedSearch = async (cursor = null, fromRefresh = false) => {
        await client.query({
            query: FEED_SEARCH,
            variables: getFeedSearchVariables(
                activeCommunityId,
                searchFilter,
                activeRoomId,
                cursor
            ),
            fetchPolicy: 'network-only'
        });

        if (fromRefresh)
            appDispatch({ type: actionTypes.TRIGGER_REFRESH, payload: false });
    };

    return (
        <div className={cx('filterAndPosts')}>
            <div className={cx('filterContainer')}>
                <Search
                    searchFilter={searchFilter}
                    setSearchFilter={setSearchFilter}
                    feedSearch={feedSearch}
                    fetchMoreNoCursor={fetchMoreNoCursor}
                    activeCommunityId={activeCommunityId}
                />
            </div>
            <RoomSelectorList />
            <div className={cx('postsContainer')}>
                <PostPreviews
                    loading={loading}
                    data={data}
                    activeCommunityId={activeCommunityId}
                    activeRoomId={activeRoomId}
                    communityCode={activeCommunity?.code}
                    fetchMore={() => {
                        // Fetch more posts using search query
                        if (appState.searchActive) {
                            let cursor =
                                data.feed.edges[data.feed.edges.length - 1]
                                    .cursor;
                            console.log(
                                `fetching more posts matching [${searchFilter}] before ${new Date(
                                    Number(cursor)
                                ).toLocaleDateString()} | ${new Date(
                                    Number(cursor)
                                ).toLocaleTimeString()}...`
                            );
                            feedSearch(cursor);
                        } else {
                            // Fetch more paginated posts in community
                            let cursor =
                                data.feed.edges[data.feed.edges.length - 1]
                                    .cursor;
                            console.log(
                                `fetching more posts before ${new Date(
                                    Number(cursor)
                                ).toLocaleDateString()} | ${new Date(
                                    Number(cursor)
                                ).toLocaleTimeString()}...`
                            );
                            fetchMore({
                                variables: getFeedQueryVariables(
                                    activeCommunityId,
                                    activeRoomId,
                                    cursor
                                )
                            });
                        }
                    }}
                />
            </div>
        </div>
    );
};

const PostPreviews = ({ loading, data, fetchMore, communityCode }) => {
    const posts = data?.feed?.edges;
    if (loading) {
        return <div className={cx('noPosts')}>Loading...</div>;
    }
    if (!posts || posts?.length === 0) {
        return <NoPostsFound communityCode={communityCode} />;
    }
    return posts.map((post, i) => {
        return (
            <React.Fragment key={post.node.id}>
                {i === data.feed.edges.length - 3 &&
                    data.feed.pageInfo.hasNextPage && (
                        <Waypoint onEnter={fetchMore} />
                    )}
                <PostPreview post={post.node} />
            </React.Fragment>
        );
    });
};

const NoPostsFound = ({ communityCode }) => {
    return (
        <div className={cx('noPostsFoundWrapper')}>
            <div className={cx('noPosts')}>No posts found...</div>
            <div className={cx('info')}>
                <FiShare className={cx('infoIcon')} />
                <div>Add this app to your homescreen</div>
            </div>
            <div className={cx('info', 'communityCodeLink')}>
                <CommunityCodeLink code={communityCode} />
            </div>
        </div>
    );
};

export default PostsContainer;
