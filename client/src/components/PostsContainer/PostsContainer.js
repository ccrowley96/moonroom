import React, { useEffect, useState } from 'react';
import PostPreview from '../PostPreview/PostPreview';
import Search from '../Search/Search';

import classNames from 'classnames/bind';
import { useReactiveVar } from '@apollo/client';
import { activeRoomIdVar } from '../../cache';
const cx = classNames.bind(require('./PostsContainer.module.scss'));

const PostsContainer = ({ posts }) => {
    const sortByDate = (posts) => {
        return posts.slice().sort((a, b) => Number(b.date) - Number(a.date));
    };

    const [activePosts, setActivePosts] = useState(sortByDate(posts));
    const activeRoomId = useReactiveVar(activeRoomIdVar);

    useEffect(() => {
        let postsInRoom = posts;
        if (activeRoomId) {
            postsInRoom = posts.filter(
                (post) => post?.room?.id === activeRoomId
            );
        }
        setActivePosts(sortByDate(postsInRoom));
    }, [posts, activeRoomId]);

    if (!posts || posts.length === 0)
        return <div className={cx('noPosts')}>No posts found.</div>;

    return (
        <div className={cx('filterAndPosts')}>
            <div className={cx('filterContainer')}>
                <Search />
            </div>
            <div className={cx('postsContainer')}>
                {activePosts.map((post) => {
                    return <PostPreview key={post.id} post={post} />;
                })}
            </div>
        </div>
    );
};

export default PostsContainer;
