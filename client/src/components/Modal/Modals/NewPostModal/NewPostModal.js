import React, { useState } from 'react';
import Modal from '../../Modal';
import { activeRoomIdVar } from '../../../../cache';
import { useReactiveVar, useMutation } from '@apollo/client';
import { NEW_POST } from '../../../../queries/post';
import { enterPressed } from '../../../../services/utils';
import { CgClose } from 'react-icons/cg';
import { useAppState } from '../../../../hooks/provideAppState';
import { actionTypes } from '../../../../constants/constants';
import { isValidURL } from '../../../../services/utils';

import classNames from 'classnames/bind';
import { GET_ACTIVE_COMMUNITY } from '../../../../queries/community';
const cx = classNames.bind(require('./NewPostModal.module.scss'));

const NewPostModal = ({ activeCommunity, postEdit = null }) => {
    const noRoomSelected = 'Uncategorized';
    const activeRoomId = useReactiveVar(activeRoomIdVar);
    const [selectedRoom, setSelectedRoom] = useState(
        activeRoomId ? activeRoomId : noRoomSelected
    );
    const { appDispatch } = useAppState();

    // Input field state
    const [title, setTitle] = useState(postEdit ? postEdit.title : '');
    const [link, setLink] = useState(postEdit ? postEdit.link : '');
    const [body, setBody] = useState(postEdit ? postEdit.body : '');
    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState(postEdit ? postEdit.tags : []);
    const [rating, setRating] = useState(
        postEdit ? postEdit.rating : 'noRating'
    );
    const [errors, setErrors] = useState({});

    // New post mutation
    const [createNewPost] = useMutation(NEW_POST, {
        update: (cache, data) => {
            // Add post to active community's post list
            // Read active community
            const activeCommunityData = cache.readQuery({
                query: GET_ACTIVE_COMMUNITY,
                variables: { communityId: activeCommunity.id }
            });

            // Overwrite cached query with new post added
            cache.writeQuery({
                query: GET_ACTIVE_COMMUNITY,
                variables: { communityId: activeCommunity.id },
                data: {
                    community: {
                        ...activeCommunityData.community,
                        posts: [
                            ...activeCommunityData.community.posts,
                            data.data.addPost.post
                        ]
                    }
                }
            });
        }
    });

    const isErrorPresent = (customErrObj) => {
        let errorObj = customErrObj ? customErrObj : errors;
        return Object.keys(errorObj).reduce(
            (_, curr) => errorObj[curr] !== null,
            false
        );
    };

    // Possible ratings
    const ratings = [1, 2, 3, 4, 5];

    const handleNewTag = () => {
        try {
            let tagText = newTag.toLowerCase();
            setNewTag('');

            if ([...tags, tagText].length > 10) {
                throw new Error('A maximum of 10 tags can be added');
            }
            if (tagText === '') {
                throw new Error('Tag cannot be empty');
            }
            if (tags.indexOf(tagText) !== -1) {
                throw new Error('Tag already added');
            }
            setTags([...tags, tagText]);
            setNewTag('');
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async () => {
        try {
            let newErrors = {};
            let cleanedLink = null;
            // Validate title
            if (title.length === 0) {
                newErrors.title = 'Title cannot be empty';
            }
            // Validate link
            if (link.length > 0 && !isValidURL(link)) {
                newErrors.link =
                    'URL must be valid and start with http:// or https://';
            } else {
                cleanedLink = isValidURL(link);
            }

            setErrors({ ...errors, ...newErrors });

            if (!isErrorPresent({ ...errors, ...newErrors })) {
                let result = await createNewPost({
                    variables: {
                        communityId: activeCommunity.id,
                        roomId:
                            selectedRoom === 'Uncategorized'
                                ? null
                                : selectedRoom,
                        title: title,
                        link: link.length > 0 ? cleanedLink : null,
                        body: body.length > 0 ? body : null,
                        rating: rating === 'noRating' ? null : Number(rating),
                        tags: tags.length > 0 ? tags : null
                    }
                });

                if (result.data['addPost'].success) {
                    // TODO add post succeeded messsage, animation / timeout here
                    appDispatch({
                        type: actionTypes.SET_ACTIVE_MODAL,
                        payload: null
                    });
                } else {
                    throw new Error(result.data['addPost'].message);
                }
            } else {
                return;
            }
        } catch (err) {
            console.error(err);
        }
    };

    const ValidationErrorText = ({ validationKey }) => {
        if (errors[validationKey]) {
            return (
                <span className={cx('_danger', 'validationErrorText')}>
                    {errors[validationKey]}
                </span>
            );
        } else {
            return null;
        }
    };

    if (!activeCommunity) return null;

    return (
        <Modal title={`Posting to ${activeCommunity.name}`}>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Select room</div>
                <select
                    className={cx('_select')}
                    value={selectedRoom}
                    onChange={(e) => {
                        let val = e.target.value;
                        setSelectedRoom(val);
                        activeRoomIdVar(val === noRoomSelected ? null : val);
                    }}
                >
                    {/* Default option */}
                    <option
                        key={'default'}
                        value={noRoomSelected}
                        onClick={() => {
                            setSelectedRoom(noRoomSelected);
                            activeRoomIdVar(null);
                        }}
                    >
                        {noRoomSelected}
                    </option>
                    {activeCommunity.rooms.map((room, idx) => {
                        return (
                            <option
                                key={idx}
                                value={room.id}
                                onClick={() => {
                                    setSelectedRoom(room.id);
                                    activeRoomIdVar(room.id);
                                }}
                            >
                                {room.name}
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('labelWrapper')}>
                    <div className={cx('_sectionLabel', '_required')}>
                        Title
                    </div>
                    <ValidationErrorText validationKey={'title'} />
                </div>
                <input
                    className={cx('_input', errors.title ? '_error' : '')}
                    placeholder={'Give your post a title'}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setErrors({ ...errors, ...{ title: null } });
                    }}
                />
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('labelWrapper')}>
                    <div className={cx('_sectionLabel')}>Link</div>
                    <ValidationErrorText validationKey={'link'} />
                </div>
                <input
                    className={cx('_input', errors.link ? '_error' : '')}
                    placeholder={'Share a link'}
                    onChange={(e) => {
                        setLink(e.target.value);
                        setErrors({ ...errors, ...{ link: null } });
                    }}
                />
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Body</div>
                <input
                    className={cx('_input')}
                    placeholder={'What are the deetz?'}
                    onChange={(e) => setBody(e.target.value)}
                />
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>
                    Rating{' '}
                    {rating === 'noRating' ? '(out of 5)' : `(${rating} / 5)`}
                </div>
                <select
                    className={cx('_select')}
                    value={rating}
                    onChange={(e) => {
                        setRating(e.target.value);
                    }}
                >
                    {/* Default option */}
                    <option key={'default'} value={'noRating'}>
                        No rating
                    </option>
                    {ratings.map((rating, idx) => {
                        return (
                            <option key={idx} value={rating}>
                                {rating} / 5
                            </option>
                        );
                    })}
                </select>
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Tags</div>
                <input
                    className={cx('_input')}
                    placeholder={'Enter some tags'}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => enterPressed(e, handleNewTag)}
                    value={newTag}
                    disabled={tags.length >= 10 ? 'disabled' : ''}
                />
                <div className={cx('tagWrapper')}>
                    {tags.map((tag) => {
                        return (
                            <div className={cx('tag')}>
                                <div className={cx('tagText')}>{tag}</div>
                                <div className={cx('deleteTagWrapper')}>
                                    <CgClose
                                        className={cx('deleteTag')}
                                        onClick={() => {
                                            setTags(
                                                tags.filter(
                                                    (tagText) => tagText !== tag
                                                )
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={cx('postWrapper')}>
                <button
                    className={cx('_btn-success')}
                    onClick={handleSubmit}
                    disabled={isErrorPresent()}
                >
                    Post
                </button>
            </div>
        </Modal>
    );
};

export default NewPostModal;
