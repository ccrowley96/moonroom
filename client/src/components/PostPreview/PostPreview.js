import React, { useState } from 'react';
import { modalTypes, actionTypes } from '../../constants/constants';
import { useAppState } from '../../hooks/provideAppState';

import classNames from 'classnames/bind';
import PostDetails from '../PostDetails/PostDetails';
const cx = classNames.bind(require('./PostPreview.module.scss'));

const PostPreview = ({post}) => {
    const { appDispatch } = useAppState();

    return(
        <div className={cx('postWrapper')} onClick={() => appDispatch({
            type: actionTypes.SET_ACTIVE_MODAL, 
            payload: modalTypes.POST_DETAILS,
            modalData: post
        })}>
            <div className={cx('title')}>{post.title}</div>
            { post.link &&
                <a href={post.link} className={cx('link')}>{post.link}</a>
            }
            <div className={cx('postPreviewFooter')}>
                <div className={cx('author')}>{post.author.given_name}</div>
                <div className={cx('postDate')}>{(new Date(Number(post.date))).toLocaleDateString()}</div>
            </div>
        </div>
    )
}

export default PostPreview;