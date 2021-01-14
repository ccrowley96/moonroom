import React, { useState } from 'react';
import PostPreview from '../PostPreview/PostPreview';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./PostsContainer.module.scss'));

const PostsContainer = ({ posts }) => {
    if (!posts || posts.length === 0)
        return <div className={cx('noPosts')}>No posts found.</div>;

    return (
        <div className={cx('filterAndPosts')}>
            <div className={cx('filterContainer')}></div>
            <div className={cx('postsContainer')}>
                {posts.map((post) => {
                    return <PostPreview key={post.id} post={post} />;
                })}
            </div>
        </div>
    );
};

export default PostsContainer;
