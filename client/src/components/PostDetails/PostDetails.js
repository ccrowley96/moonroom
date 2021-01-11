import React from 'react';
import { DELETE_POST } from '../../queries/post';
import Modal from '../Modal/Modal';
import { useAppState } from '../../hooks/provideAppState';
import { useAuth } from '../../hooks/auth';
import { activeCommunityIdVar } from '../../cache';
import { actionTypes } from '../../constants/constants';

import classNames from 'classnames/bind';
import { useMutation, useReactiveVar } from '@apollo/client';
import { GET_ACTIVE_COMMUNITY } from '../../queries/community';
const cx = classNames.bind(require('./PostDetails.module.scss'));

const PostDetails = () => {
    const { appState: { modalData : post }, appDispatch } = useAppState();
    const auth = useAuth();
    const activeCommunityId = useReactiveVar(activeCommunityIdVar)

    const [ deletePost ] = useMutation(DELETE_POST, {
        update(cache){
            // Remove post from active community
            const queryVars = { communityId: activeCommunityId };
            
            // Read active community
            let activeCommunityData = cache.readQuery({
                query: GET_ACTIVE_COMMUNITY,
                variables: queryVars
            })

            // Write new community and filter out deleted post
            cache.writeQuery({
                query: GET_ACTIVE_COMMUNITY, 
                variables: queryVars,
                data: { 
                    community: {
                        ...activeCommunityData.community,
                        posts: activeCommunityData.community.posts.filter(p => p.id !== post.id)
                    } 
                }
            })

            // Close modal
            appDispatch({type: actionTypes.SET_ACTIVE_MODAL, payload: null, modalData: null});
        }
    })

    return(
        <Modal title={post.title}>
            <div className={cx('postDetailsWrapper')}>
                { post.link &&
                    <a href={post.link} className={cx('link')}>{post.link}</a>
                }
                <div className={cx('body')}>{post.body}</div>
                
                <div className={cx('footer')}>
                    <div className={cx('meta')}>
                        <div className={cx('author')}>{post.author.given_name}</div>
                        <div className={cx('date')}>{(new Date(Number(post.date))).toLocaleDateString()}</div>
                    </div>
                    { post.author.id === auth.session.user._id &&
                        <div className={cx('postControls')}>
                            <button className={cx('control', '_btn')}>Edit</button>
                            <button className={cx('control', '_btn')} onClick={() => {
                                deletePost({variables: {postId: post.id}});
                            }}>
                                Delete
                            </button>
                        </div>
                    }
                </div>
            </div>
        </Modal>
    );
};

export default PostDetails;