import React, { useEffect, useState } from 'react';
import PostPreview from '../PostPreview/PostPreview';
import Search from '../Search/Search';
import { FEED_QUERY, FEED_SEARCH } from '../../queries/post';
import { useApolloClient, useQuery, useReactiveVar } from '@apollo/client';
import { activeCommunityIdVar, activeRoomIdVar } from '../../cache';
import { Waypoint } from 'react-waypoint';

import classNames from 'classnames/bind';
import {
    getFeedQueryVariables,
    getFeedSearchVariables
} from '../../services/utils';
import { useDidUpdateEffect } from '../../hooks/misc';
import { useAppState } from '../../hooks/provideAppState';
import RoomSelectorList from '../RoomSelectorList/RoomSelectorList';
const cx = classNames.bind(require('./PostsContainer.module.scss'));

const PostsContainer = () => {
    const [searchFilter, setSearchFilter] = useState('');
    const activeCommunityId = useReactiveVar(activeCommunityIdVar);
    const activeRoomId = useReactiveVar(activeRoomIdVar);
    const { appState } = useAppState();
    const client = useApolloClient();

    const { loading, data, fetchMore } = useQuery(FEED_QUERY, {
        variables: getFeedQueryVariables(activeCommunityId, activeRoomId)
    });

    const fetchMoreNoCursor = () => {
        fetchMore({
            variables: getFeedQueryVariables(activeCommunityId, activeRoomId)
        });
    };

    // Re-fetch on room change
    useDidUpdateEffect(() => {
        fetchMoreNoCursor();
    }, [activeRoomId]);

    // Re-fetch on community change
    useEffect(() => {
        fetchMoreNoCursor();
        setSearchFilter('');
        // eslint-disable-next-line
    }, [activeCommunityId]);

    const feedSearch = async (cursor = null) => {
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

const PostPreviews = ({
    loading,
    data,
    activeCommunityId,
    activeRoomId,
    fetchMore
}) => {
    const posts = data?.feed?.edges;
    if (loading) {
        return <div className={cx('noPosts')}>Loading...</div>;
    }
    if (!posts || posts?.length === 0) {
        return <div className={cx('noPosts')}>No posts found :/</div>;
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

export default PostsContainer;
