import React, { useEffect, useState } from 'react';
import PostPreview from '../PostPreview/PostPreview';
import Search from '../Search/Search';

import classNames from 'classnames/bind';
import { useReactiveVar } from '@apollo/client';
import { activeRoomIdVar } from '../../cache';
const cx = classNames.bind(require('./PostsContainer.module.scss'));

const PostsContainer = () => {
    const [activePosts, setActivePosts] = useState([]);

    return (
        <div className={cx('filterAndPosts')}>
            <div className={cx('filterContainer')}>
                <Search setActivePosts={setActivePosts} />
            </div>
            <div className={cx('postsContainer')}>
                {!activePosts || activePosts.length === 0 ? (
                    <div className={cx('noPosts')}>No posts found.</div>
                ) : (
                    activePosts.map((post) => {
                        return <PostPreview key={post.id} post={post} />;
                    })
                )}
            </div>
        </div>
    );
};

export default PostsContainer;
