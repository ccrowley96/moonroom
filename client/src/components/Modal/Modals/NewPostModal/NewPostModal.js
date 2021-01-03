import React, { useState } from 'react';
import Modal from '../../Modal';
import { activeRoomIdVar } from '../../../../cache';
import { useReactiveVar, useMutation } from '@apollo/client';
import { NEW_POST } from '../../../../queries/post';
import { enterPressed } from '../../../../services/utils'
import { CgClose } from 'react-icons/cg';


import classNames from 'classnames/bind';
const cx = classNames.bind(require('./NewPostModal.module.scss'));


const NewPostModal = ({activeCommunity}) => {
    const noRoomSelected = 'Uncategorized';
    const activeRoomId = useReactiveVar(activeRoomIdVar)
    const [selectedRoom, setSelectedRoom] = useState(activeRoomId ? activeRoomId : noRoomSelected)

    // Input field state
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [body, setBody] = useState('');
    const [newTag, setNewTag] = useState('');
    const [tags, setTags] = useState([]);
    const [rating, setRating] = useState('noRating')

    // New post mutation
    const [ createNewPost ] = useMutation(NEW_POST) // TODO add cache update

    // Possible ratings
    const ratings = [1,2,3,4,5]

    const handleNewTag = () => {
        try{
            let tagText = newTag.toLowerCase();
            setNewTag('');

            if([...tags, tagText].length > 10){
                throw new Error('A maximum of 10 tags can be added');
            }
            if(tagText === ''){
                throw new Error('Tag cannot be empty');
            }
            if(tags.indexOf(tagText) !== -1){
                throw new Error('Tag already added');
            }
            setTags([...tags, tagText]);
            setNewTag('');
        } catch(err){
            console.log(err);
        }
    }

    const handleSubmit = () => {
        try{

        } catch(err){

        }
    }

    return(
        <Modal title={`Posting to ${activeCommunity.name}`}>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Select room</div>
                    <select className={cx('_select')} value={selectedRoom} onChange={(e) => {
                        let val = e.target.value;
                        setSelectedRoom(val);
                        activeRoomIdVar(val === noRoomSelected ? null : val);
                    }}>
                        {/* Default option */}
                        <option key={'default'} value={noRoomSelected} onClick={() => {
                            setSelectedRoom(noRoomSelected);
                            activeRoomIdVar(null);
                        }}>
                            {noRoomSelected}
                        </option>
                        {
                            activeCommunity.rooms.map((room, idx) => {
                                return(
                                    <option key={idx} value={room.id} onClick={() => {
                                        setSelectedRoom(room.id);
                                        activeRoomIdVar(room.id);
                                    }}>
                                        {room.name}
                                    </option>
                                )
                            })
                        }
                    </select>

            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel', '_required')}>Title</div>
                <input 
                    className={cx('_input')}
                    placeholder={'Give your post a title'}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Link</div>
                <input 
                    className={cx('_input')}
                    placeholder={'Share a link'}
                    onChange={(e) => setLink(e.target.value)}
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
                <div className={cx('_sectionLabel')}>Rating {rating === 'noRating' ? '(out of 5)' : `(${rating} / 5)`}</div>
                <select className={cx('_select')} value={rating} onChange={(e) => {
                    setRating(e.target.value)
                }}>
                    {/* Default option */}
                    <option key={'default'} value={'noRating'}>
                        No rating
                    </option>
                    {
                        ratings.map((rating, idx) => {
                            return(
                                <option key={idx} value={rating}>{rating} / 5</option>
                            )
                        })
                    }
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
                    {
                        tags.map(tag => {
                            return(
                                <div className={cx('tag')}>
                                    <div className={cx('tagText')}>
                                        {tag}
                                    </div>
                                    <div className={cx('deleteTagWrapper')}>
                                        <CgClose className={cx('deleteTag')} onClick={() => {
                                            setTags(tags.filter(tagText => tagText !== tag))
                                        }}/>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={cx('postWrapper')}>
                <button className={cx('_btn-success')} onClick={handleSubmit}>Post</button>
            </div>
        </Modal>
    )
}

export default NewPostModal;