import React from 'react';
import { modalTypes, actionTypes } from '../../constants/constants';
import { useAppState } from '../../hooks/provideAppState';
import { BsArrowRightShort } from 'react-icons/bs';
import { FiLink } from 'react-icons/fi';
import { BiShuffle } from 'react-icons/bi';

import classNames from 'classnames/bind';
import { formatShortDateString } from '../../services/utils';
import PostDetails from '../PostDetails/PostDetails';
const cx = classNames.bind(require('./PostPreview.module.scss'));

const PostPreview = ({ post }) => {
    const {
        appDispatch,
        appState: { activeModal, modalData }
    } = useAppState();

    let linkText = 'External link';
    if (post.link) {
        try {
            linkText = new URL(post.link).host;
        } catch (err) {
            linkText = 'External link';
            console.log(err);
        }
    }

    return (
        <>
            {activeModal === modalTypes.POST_DETAILS &&
                modalData.id === post.id && <PostDetails post={post} />}
            <div
                className={cx('postWrapper')}
                onClick={() =>
                    appDispatch({
                        type: actionTypes.SET_ACTIVE_MODAL,
                        payload: modalTypes.POST_DETAILS,
                        modalData: post
                    })
                }
            >
                <div className={cx('title')}>{post.title}</div>
                {post.link && (
                    <div
                        href={post.link}
                        target="_blank"
                        rel="noreferrer"
                        className={cx('link')}
                    >
                        <a
                            href={post.link}
                            target="_blank"
                            rel="noreferrer"
                            className={cx('linkText')}
                        >
                            {linkText}
                        </a>
                        <FiLink className={cx('linkIcon')} />
                    </div>
                )}
                <div className={cx('postPreviewFooter')}>
                    <div className={cx('author')}>
                        <span className={cx('postMeta')}>
                            {post.author.given_name}{' '}
                            {post.room?.name ? (
                                <>
                                    {post.sourcePost ? (
                                        <div
                                            className={cx('inRoomIconWrapper')}
                                        >
                                            <BiShuffle
                                                className={cx(
                                                    'inRoomIcon',
                                                    'crossPost'
                                                )}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={cx('inRoomIconWrapper')}
                                        >
                                            <BsArrowRightShort
                                                className={cx('inRoomIcon')}
                                            />
                                        </div>
                                    )}
                                    {post.room.name}
                                </>
                            ) : null}
                        </span>
                    </div>
                    <div className={cx('postDate')}>
                        {formatShortDateString(post.date)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PostPreview;
