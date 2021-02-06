import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames/bind';
import { DELETE_POST, DELETE_REPLY, GET_POST } from '../../queries/post';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ReactTinyLink } from 'react-tiny-link';
import { useTheme } from '../../hooks/provideTheme';
import { actionTypes, modalTypes, themes } from '../../constants/constants';
import { formatDateTimeString } from '../../services/utils';
import { AiFillStar, AiOutlineDelete, AiOutlineTag } from 'react-icons/ai';
import { BiShuffle } from 'react-icons/bi';
import { useAuth } from '../../hooks/auth';
import Reply from '../Reply/Reply';
import Modal from '../Modal/Modal';
import { FiEdit2 } from 'react-icons/fi';
import { GET_ACTIVE_COMMUNITY, MY_COMMUNITIES } from '../../queries/community';
import { activeCommunityIdVar } from '../../cache';
import AddEditPostModal from '../Modal/Modals/AddEditPostModal/AddEditPostModal';
import { useAppState } from '../../hooks/provideAppState';
import CrossPostModal from '../Modal/Modals/CrossPostModal/CrossPostModal';

const cx = classNames.bind(require('./PostFullView.module.scss'));

const PostFullView = () => {
    const { id } = useParams();
    const history = useHistory();
    const { theme } = useTheme();
    const auth = useAuth();
    const [linkPreview, setLinkPreview] = useState(false);
    const [editReplyData, setEditReplyData] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState({
        commentDelete: false,
        postDelete: false,
        data: null
    });
    const {
        appState: { activeModal },
        appDispatch
    } = useAppState();
    const [asyncLoading, setAsyncLoading] = useState(false);
    const [deleteReply] = useMutation(DELETE_REPLY);
    const activeCommunityId = useReactiveVar(activeCommunityIdVar);

    // Query active community using activeCommunityId
    const { data: activeCommunityData } = useQuery(GET_ACTIVE_COMMUNITY, {
        variables: {
            communityId: activeCommunityId
        },
        errorPolicy: 'all',
        skip: !activeCommunityId
    });

    // Grab list of all communities
    const { data: communitiesData } = useQuery(MY_COMMUNITIES, {
        errorPolicy: 'all'
    });

    const { loading, data, error } = useQuery(GET_POST, {
        variables: { postId: id }
    });
    const [copied, setCopied] = useState(false);

    const post = data?.post;

    const confirmDeleteReply = async () => {
        setAsyncLoading(true);
        await deleteReply({
            variables: { postId: post.id, commentId: isConfirmOpen.data }
        });
        setAsyncLoading(false);
    };

    const confirmDeletePost = async () => {
        setAsyncLoading(true);
        await deletePost({
            variables: { postId: post.id }
        });
        setAsyncLoading(false);
    };

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

            // Redirect to home
            history.push('/');
        }
    });

    const setConfirmClosedFromModal = (_) => {
        setIsConfirmOpen({
            commentDelete: false,
            postDelete: false,
            data: null
        });
    };

    const onConfirmed = () => {
        if (isConfirmOpen.commentDelete) {
            confirmDeleteReply();
        } else {
            confirmDeletePost();
        }
    };

    useEffect(() => {
        let timeout = null;
        if (copied) {
            timeout = setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [copied]);

    return (
        <div className={cx('postWrapper')}>
            {(isConfirmOpen.postDelete || isConfirmOpen.commentDelete) && (
                <Modal
                    isConfirmOpen={true}
                    setIsConfirmOpen={setConfirmClosedFromModal}
                    onConfirmed={onConfirmed}
                >
                    <div className={cx('modalFiller')}></div>
                </Modal>
            )}
            {activeModal === modalTypes.NEW_POST && (
                <AddEditPostModal
                    activeCommunity={activeCommunityData?.community}
                />
            )}
            {activeModal === modalTypes.CROSSPOST && (
                <CrossPostModal
                    communities={communitiesData?.myCommunities}
                    activeCommunity={activeCommunityData?.community}
                />
            )}

            <div className={cx('postNav')}>
                <div className={cx('copyBtn')}>
                    <CopyToClipboard
                        text={window.location}
                        onCopy={() => setCopied(true)}
                    >
                        <button className={cx('_btn')}>Copy post link</button>
                    </CopyToClipboard>
                    <div className={cx('clickInfo')}>
                        {copied ? 'Post link copied...' : ''}
                    </div>
                </div>
                <button
                    className={cx('_btn')}
                    onClick={() => history.push('/')}
                >
                    Home
                </button>
            </div>
            {loading ? (
                <div className={cx('loadingAndError')}>Loading post...</div>
            ) : error ? (
                <div className={cx('loadingAndError')}>
                    Error loading post :(
                </div>
            ) : (
                <div className={cx('post')}>
                    {post.link && (
                        <div
                            className={cx('link', linkPreview ? 'loaded' : '')}
                        >
                            <ReactTinyLink
                                cardSize="small"
                                showGraphic={true}
                                maxLine={2}
                                minLine={1}
                                proxyUrl={'/cors'}
                                url={post.link}
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
                    <div className={cx('postTitle')}>{post.title}</div>
                    <div className={cx('postMetaWrapper')}>
                        <div className={cx('postMeta')}>
                            <div className={cx('author')}>
                                {post.author.given_name}
                            </div>
                            <div className={cx('date')}>
                                {formatDateTimeString(post.date)}
                            </div>
                        </div>
                        {post.rating && (
                            <div className={cx('postRating')}>
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
                        )}
                    </div>
                    {post.sourcePost && (
                        <div className={cx('crossPostMetaWrapper')}>
                            <div className={cx('crossPostMeta')}>
                                <div className={cx('community')}>
                                    Cross-posted from{' '}
                                    <span className={cx('sourceCommunityName')}>
                                        {post.sourcePost.community.name}
                                    </span>
                                </div>
                                <div className={cx('author')}>
                                    Authored by{' '}
                                    <span className={cx('sourceAuthorName')}>
                                        {post.sourcePost.author.given_name}
                                    </span>
                                </div>
                            </div>
                            <div className={cx('crossPostIconWrapper')}>
                                <BiShuffle className={cx('crossPostIcon')} />
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
                    <div className={cx('controlsWrapper')}>
                        {post.author.id === auth.session.user._id && (
                            <div className={cx('adminControls')}>
                                <button
                                    className={cx(
                                        'controlWrapper',
                                        '_btn',
                                        'editWrapper'
                                    )}
                                    onClick={() => {
                                        appDispatch({
                                            type: actionTypes.SET_ACTIVE_MODAL,
                                            payload: modalTypes.NEW_POST,
                                            modalData: post
                                        });
                                    }}
                                >
                                    Edit
                                    <FiEdit2
                                        className={cx('control', 'edit')}
                                    />
                                </button>
                                <button
                                    className={cx('controlWrapper', '_btn')}
                                    onClick={() => {
                                        if (!asyncLoading)
                                            setIsConfirmOpen({
                                                commentDelete: false,
                                                postDelete: true,
                                                data: null
                                            });
                                    }}
                                >
                                    Delete
                                    <AiOutlineDelete
                                        className={cx('control', 'delete')}
                                    />
                                </button>
                            </div>
                        )}
                        <button
                            className={cx('controlWrapper', '_btn')}
                            onClick={() => {
                                appDispatch({
                                    type: actionTypes.SET_ACTIVE_MODAL,
                                    payload: modalTypes.CROSSPOST,
                                    modalData: post
                                });
                            }}
                        >
                            Cross post
                            <BiShuffle className={cx('control', 'crossPost')} />
                        </button>
                    </div>
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
                                                            onClick={() =>
                                                                setIsConfirmOpen(
                                                                    {
                                                                        commentDelete: true,
                                                                        postDelete: false,
                                                                        data:
                                                                            comment.id
                                                                    }
                                                                )
                                                            }
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
                    <div className={cx('replyWrapper')}>
                        <Reply
                            postId={post.id}
                            editReplyData={editReplyData}
                            clearData={() => setEditReplyData(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostFullView;
