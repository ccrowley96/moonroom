import React from 'react';
import { modalTypes, actionTypes } from '../../constants/constants';
import { useAppState } from '../../hooks/provideAppState';
import { BsArrowRightShort } from 'react-icons/bs';
import { FiLink } from 'react-icons/fi';

import classNames from 'classnames/bind';
import { formatShortDateString } from '../../services/utils';
import PostDetails from '../PostDetails/PostDetails';
const cx = classNames.bind(require('./PostPreview.module.scss'));

const PostPreview = ({ post }) => {
    const {
        appDispatch,
        appState: { activeModal, modalData }
    } = useAppState();

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
                            {post.link}
                        </a>
                        <FiLink className={cx('linkIcon')} />
                    </div>
                )}
                <div className={cx('postPreviewFooter')}>
                    <div className={cx('author')}>
                        {post.author.given_name}{' '}
                        {post.room?.name ? (
                            <>
                                <BsArrowRightShort
                                    className={cx('inRoomIcon')}
                                />{' '}
                                {post.room.name}
                            </>
                        ) : null}
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
