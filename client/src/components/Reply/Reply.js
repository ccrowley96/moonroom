import { useMutation, useReactiveVar } from '@apollo/client';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { activeCommunityIdVar } from '../../cache';
import { NEW_REPLY } from '../../queries/post';
import { enterPressed } from '../../services/utils';
const cx = classNames.bind(require('./Reply.module.scss'));

const Reply = ({ postId }) => {
    const [reply, setReply] = useState('');
    const [sendReply] = useMutation(NEW_REPLY);
    const communityId = useReactiveVar(activeCommunityIdVar);

    const handleSubmitReply = async () => {
        try {
            if (reply === '') {
                return;
            }

            let result = await sendReply({
                variables: {
                    postId,
                    communityId,
                    body: reply
                }
            });

            setReply('');

            if (result.data.addComment.success) {
            } else {
                throw new Error(result.data.addComment.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={cx('replyForm')}>
            <input
                className={cx('_input', 'replyInput')}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyPress={(e) => enterPressed(e, handleSubmitReply)}
            />
            <button
                className={cx('replyBtn')}
                onClick={handleSubmitReply}
                disabled={reply === ''}
            >
                Reply
            </button>
        </div>
    );
};

export default Reply;
