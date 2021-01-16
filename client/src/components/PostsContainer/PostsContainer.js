import React, { useEffect, useState } from 'react';
import PostPreview from '../PostPreview/PostPreview';
import Search from '../Search/Search';
import { FEED_QUERY } from '../../queries/post';
import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client';
import { activeRoomIdVar, activeCommunityIdVar } from '../../cache';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./PostsContainer.module.scss'));

const PostsContainer = () => {
    const [searchFilter, setSearchFilter] = useState('');
    const activeCommunityId = useReactiveVar(activeCommunityIdVar);
    const activeRoomId = useReactiveVar(activeRoomIdVar);
    const { loading, data, error } = useQuery(FEED_QUERY, {
        variables: {
            communityId: activeCommunityId
        }
    });

    // const fetchFeed = () => {
    //     executeFeed({
    //         variables: {
    //             filter: searchFilter,
    //             communityId: activeCommunityId,
    //             ...(activeRoomId && { roomId: activeRoomId })
    //         }
    //     });
    // };

    // Fetch on initial load
    // useEffect(() => {
    //     fetchFeed();
    // }, []);

    return (
        <div className={cx('filterAndPosts')}>
            <div className={cx('filterContainer')}>
                <Search
                    searchFilter={searchFilter}
                    setSearchFilter={setSearchFilter}
                    // fetchFeed={fetchFeed}
                />
            </div>
            <div className={cx('postsContainer')}>
                <PostPreviews loading={loading} data={data} />
            </div>
        </div>
    );
};

const PostPreviews = ({ loading, data }) => {
    const posts = data?.feed;
    if (loading) {
        return <div className={cx('noPosts')}>Loading...</div>;
    }
    if (!posts || posts?.length === 0) {
        return <div className={cx('noPosts')}>No posts found.</div>;
    }

    // Sort data by date
    const sortedPosts = posts
        .slice()
        .sort((a, b) => Number(b.date) - Number(a.date));

    return sortedPosts.map((post) => {
        return <PostPreview key={post.id} post={post} />;
    });
};

export default PostsContainer;
