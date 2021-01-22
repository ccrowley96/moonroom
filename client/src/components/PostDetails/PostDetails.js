import React, { useEffect, useRef, useState } from 'react';
import { DELETE_POST } from '../../queries/post';
import Modal from '../Modal/Modal';
import { useAppState } from '../../hooks/provideAppState';
import { useAuth } from '../../hooks/auth';
import { actionTypes, modalTypes } from '../../constants/constants';
import { AiOutlineStar, AiOutlineDelete } from 'react-icons/ai';
import { FiEdit2 } from 'react-icons/fi';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

import classNames from 'classnames/bind';
import { useMutation } from '@apollo/client';
import {
    formatDateTimeString,
    formatShortDateString
} from '../../services/utils';
import Reply from '../Reply/Reply';
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
            title={post.title}
        >
            <div className={cx('postDetailsWrapper')}>
                <div className={cx('postDetails')} ref={targetRef}>
                    <div className={cx('_modalSection')}>
                        <div className={cx('meta')}>
                            <div className={cx('author')}>
                                {post.author.given_name}
                            </div>
                            <div className={cx('date')}>
                                - {formatDateTimeString(post.date)}
                            </div>
                        </div>
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
                    {post.author.id === auth.session.user._id && (
                        <div className={cx('postControls')}>
                            <FiEdit2
                                className={cx('control', 'edit')}
                                onClick={() => {
                                    appDispatch({
                                        type: actionTypes.SET_ACTIVE_MODAL,
                                        payload: modalTypes.NEW_POST,
                                        modalData: post
                                    });
                                }}
                            />
                            <AiOutlineDelete
                                className={cx('control', 'delete')}
                                onClick={() => setIsConfirmOpen(true)}
                            />
                        </div>
                    )}
                    <div className={cx('replyWrapper')}>
                        <Reply />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PostDetails;
