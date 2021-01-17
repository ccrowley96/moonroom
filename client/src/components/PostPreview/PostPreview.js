import React from 'react';
import { modalTypes, actionTypes } from '../../constants/constants';
import { useAppState } from '../../hooks/provideAppState';
import { BsArrowRightShort } from 'react-icons/bs';

import classNames from 'classnames/bind';
import { formatShortDateString } from '../../services/utils';
const cx = classNames.bind(require('./PostPreview.module.scss'));

const PostPreview = ({ post }) => {
    const { appDispatch } = useAppState();

    return (
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
                <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    className={cx('link')}
                >
                    {post.link}
                </a>
            )}
            <div className={cx('postPreviewFooter')}>
                <div className={cx('author')}>
                    {post.author.given_name}{' '}
                    {post.room?.name ? (
                        <>
                            <BsArrowRightShort className={cx('inRoomIcon')} />{' '}
                            {post.room.name}
                        </>
                    ) : null}
                </div>
                <div className={cx('postDate')}>
                    {formatShortDateString(post.date)}
                </div>
            </div>
        </div>
    );
};

export default PostPreview;
