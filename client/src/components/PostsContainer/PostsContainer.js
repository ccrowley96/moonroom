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
    const [searchData, setSearchData] = useState(null);
    const activeCommunityId = useReactiveVar(activeCommunityIdVar);
    const activeRoomId = useReactiveVar(activeRoomIdVar);
    const { appState, appDispatch } = useAppState();
    const client = useApolloClient();
    const triggerRefresh = appState.triggerRefresh;

    const { loading, data, fetchMore } = useQuery(FEED_QUERY, {
        variables: getFeedQueryVariables(activeCommunityId, activeRoomId)
    });

    const fetchMoreNoCursor = async (fromRefresh = false) => {
        if (fetchMore) {
            await fetchMore({
                variables: getFeedQueryVariables(
                    activeCommunityId,
                    activeRoomId
                )
            });

            if (fromRefresh)
                appDispatch({
                    type: actionTypes.TRIGGER_REFRESH,
                    payload: false
                });
        }
    };

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

    // Re-fetch on room change (when search active)
    useDidUpdateEffect(() => {
        if (appState.searchActive) {
            feedSearch();
        }
    }, [activeRoomId]);

    useEffect(() => {
        if (appState.tagSearch) {
            setSearchFilter(appState.tagSearch);
            appDispatch({
                type: actionTypes.SET_SEARCH_ACTIVE,
                payload: true
            });
            feedSearch();
        }
    }, [appState.tagSearch]);

    const feedSearch = async (cursor = null, fromRefresh = false) => {
        let result = await client.query({
            query: FEED_SEARCH,
            variables: getFeedSearchVariables(
                activeCommunityId,
                appState.tagSearch ? appState.tagSearch : searchFilter,
                activeRoomId,
                cursor
            ),
            ...(cursor && { fetchPolicy: 'network-only' })
        });

        setSearchData(result.data.feedSearch);

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
            {appState.searchActive && searchFilter.length > 0 && (
                <div className={cx('searchCallout')}>
                    Posts matching '<b>{searchFilter}</b>'
                </div>
            )}
            <div className={cx('postsContainer')}>
                <PostPreviews
                    loading={loading}
                    data={appState.searchActive ? searchData : data?.feed}
                    activeCommunityId={activeCommunityId}
                    activeRoomId={activeRoomId}
                    communityCode={activeCommunity?.code}
                    fetchMore={() => {
                        // Fetch more posts using search query
                        if (appState.searchActive) {
                            let cursor =
                                searchData.edges[searchData.edges.length - 1]
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
                            fetchMore &&
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
    const posts = data?.edges;
    if (loading) {
        return <div className={cx('loading')}>Loading...</div>;
    }
    if (!posts || posts?.length === 0) {
        return <NoPostsFound communityCode={communityCode} />;
    }
    return posts.map((post, i) => {
        return (
            <React.Fragment key={post.node.id}>
                {i === data.edges.length - 3 && data.pageInfo.hasNextPage && (
                    <Waypoint
                        onEnter={() => {
                            fetchMore();
                        }}
                    />
                )}
                <PostPreview post={post.node} />
            </React.Fragment>
        );
    });
};

const NoPostsFound = ({ communityCode }) => {
    const { appState } = useAppState();
    return (
        <div className={cx('noPostsFoundWrapper')}>
            <div className={cx('noPosts')}>
                No posts found{' '}
                {appState.searchActive ? 'matching your search' : ''}...
            </div>
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
