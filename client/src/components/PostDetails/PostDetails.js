import React, { useEffect, useRef, useState } from 'react';
import { DELETE_POST, DELETE_REPLY } from '../../queries/post';
import Modal from '../Modal/Modal';
import { useAppState } from '../../hooks/provideAppState';
import { useTheme } from '../../hooks/provideTheme';
import { useAuth } from '../../hooks/auth';
import { actionTypes, modalTypes, themes } from '../../constants/constants';
import { AiFillStar, AiOutlineTag, AiOutlineDelete } from 'react-icons/ai';
import { FiEdit2, FiShare } from 'react-icons/fi';
import { BiShuffle } from 'react-icons/bi';
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import { ReactTinyLink } from 'react-tiny-link';

import classNames from 'classnames/bind';
import { useMutation } from '@apollo/client';
import { formatDateTimeString } from '../../services/utils';
import Reply from '../Reply/Reply';
import { useHistory } from 'react-router-dom';
const cx = classNames.bind(require('./PostDetails.module.scss'));

const PostDetails = ({ post }) => {
    const { appDispatch } = useAppState();
    const { theme } = useTheme();
    const auth = useAuth();
    const [isConfirmOpen, setIsConfirmOpen] = useState({
        postDelete: false,
        commentDelete: false,
        data: null
    });
    const [editReplyData, setEditReplyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [linkPreview, setLinkPreview] = useState(false);
    const history = useHistory();

    const setConfirmClosedFromModal = (_) => {
        setIsConfirmOpen({
            postDelete: false,
            commentDelete: false,
            data: null
        });
    };

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

    const [deleteReply] = useMutation(DELETE_REPLY);

    const confirmDelete = async () => {
        setLoading(true);
        await deletePost({
            variables: { postId: post.id }
        });
        setLoading(false);
    };

    const confirmDeleteReply = async (commentId) => {
        setLoading(true);
        await deleteReply({
            variables: { postId: post.id, commentId }
        });
        setLoading(false);
    };

    const onConfirmed = () => {
        if (isConfirmOpen.postDelete) {
            confirmDelete();
        } else if (isConfirmOpen.commentDelete) {
            confirmDeleteReply(isConfirmOpen.data);
        }
    };

    return (
        <Modal
            isConfirmOpen={
                isConfirmOpen.postDelete || isConfirmOpen.commentDelete
            }
            setIsConfirmOpen={setConfirmClosedFromModal}
            onConfirmed={onConfirmed}
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
                                {formatDateTimeString(post.date)}
                            </div>
                        </div>
                        {post.sourcePost && (
                            <div className={cx('crossPostMetaWrapper')}>
                                <div className={cx('crossPostMeta')}>
                                    <div className={cx('community')}>
                                        Cross-posted from{' '}
                                        <span
                                            className={cx(
                                                'sourceCommunityName'
                                            )}
                                        >
                                            {post.sourcePost.community.name}
                                        </span>
                                    </div>
                                    <div className={cx('author')}>
                                        Authored by{' '}
                                        <span
                                            className={cx('sourceAuthorName')}
                                        >
                                            {post.sourcePost.author.given_name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {post.link && (
                        <div
                            className={cx('link', linkPreview ? 'loaded' : '')}
                        >
                            <ReactTinyLink
                                cardSize="small"
                                showGraphic={true}
                                maxLine={2}
                                minLine={1}
                                url={post.link}
                                proxyUrl={'/cors'}
                                defaultMedia={
                                    theme === themes.dark
                                        ? '/logo192_dark.png'
                                        : '/logo192.png'
                                }
                                onSuccess={() => setLinkPreview(true)}
                                onError={() => setLinkPreview(true)}
                            />
                        </div>
                    )}
                    {post.rating && (
                        <div className={cx('_modalSection')}>
                            <div className={cx('ratingWrapper')}>
                                {Array.from(Array(Math.floor(post.rating))).map(
                                    (_, idx) => {
                                        return (
                                            <AiFillStar
                                                key={idx}
                                                className={cx('ratingStar')}
                                            />
                                        );
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
                                            <AiOutlineTag
                                                className={cx('tagIcon')}
                                            />
                                            <div className={cx('tagText')}>
                                                {tag}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {post.body && (
                        <div className={cx('_modalSection')}>
                            <div className={cx('body')}>{post.body}</div>
                        </div>
                    )}
                    {post.comments && post.comments.length > 0 && (
                        <div className={cx('_modalSection')}>
                            <div className={cx('commentHeader')}>Replies: </div>
                            <div className={cx('commentsWrapper')}>
                                {post.comments.map((comment, idx) => {
                                    return (
                                        <div
                                            key={idx}
                                            className={cx('comment')}
                                        >
                                            <div className={cx('commentMeta')}>
                                                <div
                                                    className={cx(
                                                        'commentAuthor'
                                                    )}
                                                >
                                                    {comment.author.given_name}
                                                </div>
                                                <div
                                                    className={cx(
                                                        'commentDate'
                                                    )}
                                                >
                                                    {formatDateTimeString(
                                                        comment.date
                                                    )}
                                                </div>
                                                {comment.author.id ===
                                                    auth.session.user._id && (
                                                    <div
                                                        className={cx(
                                                            'commentAdmin'
                                                        )}
                                                    >
                                                        <div
                                                            className={cx(
                                                                'adminBtn'
                                                            )}
                                                            onClick={() => {
                                                                setEditReplyData(
                                                                    comment
                                                                );
                                                            }}
                                                        >
                                                            edit
                                                        </div>
                                                        <div
                                                            className={cx(
                                                                'adminBtn'
                                                            )}
                                                            onClick={() => {
                                                                if (!loading)
                                                                    setIsConfirmOpen(
                                                                        {
                                                                            commentDelete: true,
                                                                            postDelete: false,
                                                                            data:
                                                                                comment.id
                                                                        }
                                                                    );
                                                            }}
                                                        >
                                                            delete
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className={cx('commentBody')}>
                                                {comment.body}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                <div className={cx('footer')}>
                    <div className={cx('postControls')}>
                        {post.author.id === auth.session.user._id && (
                            <>
                                <button
                                    className={cx('_btn', 'controlBtn')}
                                    onClick={() => {
                                        appDispatch({
                                            type: actionTypes.SET_ACTIVE_MODAL,
                                            payload: modalTypes.NEW_POST,
                                            modalData: post
                                        });
                                    }}
                                >
                                    <div className={cx('btnText')}>Edit</div>
                                    <FiEdit2
                                        className={cx('control', 'edit')}
                                    />
                                </button>
                                <button
                                    className={cx('_btn', 'controlBtn')}
                                    onClick={() => {
                                        if (!loading)
                                            setIsConfirmOpen({
                                                commentDelete: false,
                                                postDelete: true,
                                                data: null
                                            });
                                    }}
                                >
                                    <div className={cx('btnText')}>Delete</div>
                                    <AiOutlineDelete
                                        className={cx('control', 'delete')}
                                    />
                                </button>
                            </>
                        )}
                        <button
                            className={cx('_btn', 'controlBtn')}
                            onClick={() => {
                                appDispatch({
                                    type: actionTypes.SET_ACTIVE_MODAL,
                                    payload: modalTypes.CROSSPOST,
                                    modalData: post
                                });
                            }}
                        >
                            <div className={cx('btnText')}>Crosspost</div>
                            <BiShuffle className={cx('control', 'crossPost')} />
                        </button>
                        <button
                            className={cx('_btn', 'controlBtn')}
                            onClick={() => history.push(`/post/${post.id}`)}
                        >
                            <div className={cx('btnText')}>Share</div>
                            <FiShare className={cx('control', 'shareLink')} />
                        </button>
                    </div>

                    <div className={cx('replyWrapper')}>
                        <Reply
                            postId={post.id}
                            editReplyData={editReplyData}
                            clearData={() => setEditReplyData(null)}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PostDetails;
