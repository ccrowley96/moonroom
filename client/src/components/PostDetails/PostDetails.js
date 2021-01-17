import React from 'react';
import { DELETE_POST, FEED_QUERY } from '../../queries/post';
import Modal from '../Modal/Modal';
import { useAppState } from '../../hooks/provideAppState';
import { useAuth } from '../../hooks/auth';
import { activeCommunityIdVar } from '../../cache';
import { actionTypes, modalTypes } from '../../constants/constants';

import classNames from 'classnames/bind';
import { useMutation, useReactiveVar } from '@apollo/client';
import { GET_ACTIVE_COMMUNITY } from '../../queries/community';
import { getFeedQueryVariables } from '../../services/utils';
const cx = classNames.bind(require('./PostDetails.module.scss'));

const PostDetails = () => {
    const {
        appState: { modalData: post, page },
        appDispatch
    } = useAppState();
    const auth = useAuth();
    const activeCommunityId = useReactiveVar(activeCommunityIdVar);

    const [deletePost] = useMutation(DELETE_POST, {
        update(cache) {
            // Remove post from active community
            const queryVars = { communityId: activeCommunityId };

            // Read active community
            let feedData = cache.readQuery({
                query: FEED_QUERY,
                variables: getFeedQueryVariables(activeCommunityId, page)
            });

            let currentPage = feedData.feed.currentPage;
            let totalPages = feedData.feed.totalPages;

            // Calculate new current page & total pages (on client cache)
            if (feedData.feed.posts.length <= 1) {
                // deleting last post on page
                appDispatch({ type: actionTypes.DECREMENT_PAGE });
            }

            // Write new community and filter out deleted post
            cache.writeQuery({
                query: FEED_QUERY,
                variables: getFeedQueryVariables(activeCommunityId, page),
                data: {
                    feed: {
                        posts: [
                            ...feedData.feed.posts.filter(
                                (p) => p.id !== post.id
                            )
                        ]
                    }
                }
            });

            // Close modal
            appDispatch({
                type: actionTypes.SET_ACTIVE_MODAL,
                payload: null,
                modalData: null
            });
        }
    });

    return (
        <Modal title={post.title}>
            <div className={cx('postDetailsWrapper')}>
                {post.link && (
                    <a href={post.link} className={cx('link')}>
                        {post.link}
                    </a>
                )}
                <div className={cx('body')}>{post.body}</div>

                <div className={cx('footer')}>
                    <div className={cx('meta')}>
                        <div className={cx('author')}>
                            {post.author.given_name}
                        </div>
                        <div className={cx('date')}>
                            {new Date(Number(post.date)).toLocaleDateString()}
                        </div>
                    </div>
                    {post.author.id === auth.session.user._id && (
                        <div className={cx('postControls')}>
                            <button
                                className={cx('control', '_btn')}
                                onClick={() => {
                                    // Open edit post modal
                                    appDispatch({
                                        type: actionTypes.SET_ACTIVE_MODAL,
                                        payload: modalTypes.NEW_POST,
                                        modalData: post
                                    });
                                }}
                            >
                                Edit
                            </button>
                            <button
                                className={cx('control', '_btn')}
                                onClick={() => {
                                    deletePost({
                                        variables: { postId: post.id }
                                    });
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default PostDetails;
