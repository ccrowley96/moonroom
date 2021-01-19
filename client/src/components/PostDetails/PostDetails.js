import React, { useEffect, useRef, useState } from 'react';
import { DELETE_POST } from '../../queries/post';
import Modal from '../Modal/Modal';
import { useAppState } from '../../hooks/provideAppState';
import { useAuth } from '../../hooks/auth';
import { actionTypes, modalTypes } from '../../constants/constants';
import { AiOutlineStar } from 'react-icons/ai';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import classNames from 'classnames/bind';
import { useMutation } from '@apollo/client';
import { formatDateTimeString } from '../../services/utils';
const cx = classNames.bind(require('./PostDetails.module.scss'));

const PostDetails = () => {
    const {
        appState: { modalData: post },
        appDispatch
    } = useAppState();
    const auth = useAuth();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const targetRef = useRef();

    // Prevent scroll while open
    useEffect(() => {
        if (targetRef.current) {
            disableBodyScroll(targetRef.current, { reserveScrollBarGap: true });
        }
        return () => clearAllBodyScrollLocks();
    }, []);

    const [deletePost] = useMutation(DELETE_POST, {
        update(cache) {
            cache.modify({
                fields: {
                    feed(currentFeed) {
                        return {
                            ...currentFeed,
                            edges: currentFeed.edges.filter((edgeRef) => {
                                return edgeRef.cursor !== post.date;
                            })
                        };
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

    const confirmDelete = () => {
        deletePost({
            variables: { postId: post.id }
        });
    };

    return (
        <Modal
            isConfirmOpen={isConfirmOpen}
            setIsConfirmOpen={setIsConfirmOpen}
            onConfirmed={confirmDelete}
        >
            <div className={cx('postDetailsWrapper')}>
                <div className={cx('postDetails')} ref={targetRef}>
                    <div className={cx('_modalSection')}>
                        <div className={cx('title')}>{post.title}</div>
                    </div>
                    {post.link && (
                        <div className={cx('_modalSection')}>
                            <a
                                href={post.link}
                                target="_blank"
                                rel="noreferrer"
                                className={cx('link')}
                            >
                                {post.link}
                            </a>
                        </div>
                    )}
                    {post.rating && (
                        <div className={cx('_modalSection')}>
                            <div className={cx('ratingWrapper')}>
                                {Array.from(Array(Math.floor(post.rating))).map(
                                    (_, idx) => {
                                        return <AiOutlineStar key={idx} />;
                                    }
                                )}
                            </div>
                        </div>
                    )}
                    {post.tags && (
                        <div className={cx('_modalSection')}>
                            <div className={cx('tagWrapper')}>
                                {post.tags.map((tag, idx) => {
                                    return (
                                        <div className={cx('tag')} key={idx}>
                                            <div className={cx('tagText')}>
                                                {tag}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className={cx('_modalSection')}>
                        <div className={cx('body')}>{post.body}</div>
                    </div>
                </div>
                <div className={cx('footer')}>
                    <div className={cx('meta')}>
                        <div className={cx('author')}>
                            {post.author.given_name}
                        </div>
                        <div className={cx('date')}>
                            {formatDateTimeString(post.date)}
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
                                onClick={() => setIsConfirmOpen(true)}
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
