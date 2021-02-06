import { useMutation, useReactiveVar } from '@apollo/client';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { activeCommunityIdVar } from '../../cache';
import { EDIT_REPLY, NEW_REPLY } from '../../queries/post';
import { enterPressed } from '../../services/utils';
const cx = classNames.bind(require('./Reply.module.scss'));

const Reply = ({ postId, editReplyData, clearData }) => {
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendReply] = useMutation(NEW_REPLY);
    const [editReply] = useMutation(EDIT_REPLY);
    const communityId = useReactiveVar(activeCommunityIdVar);

    useEffect(() => {
        if (editReplyData?.body) setReply(editReplyData.body);
    }, [editReplyData]);

    const handleSubmitReply = async () => {
        try {
            if (reply === '') {
                return;
            }

            let result;
            let dataKey = 'addComment';
            setLoading(true);

            if (editReplyData) {
                dataKey = 'editComment';
                result = await editReply({
                    variables: {
                        postId,
                        communityId,
                        commentId: editReplyData.id,
                        body: reply
                    }
                });
            } else {
                result = await sendReply({
                    variables: {
                        postId,
                        communityId,
                        body: reply
                    }
                });
            }
            setLoading(false);

            setReply('');
            clearData();

            if (result.data[dataKey].success) {
            } else {
                throw new Error(result.data[dataKey].message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={cx('replyForm')}>
            <input
                type="text"
                className={cx('_input', 'replyInput')}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyPress={(e) =>
                    !loading && enterPressed(e, handleSubmitReply)
                }
            />
            <button
                className={cx('replyBtn')}
                onClick={handleSubmitReply}
                disabled={reply === '' || loading}
            >
                {editReplyData ? 'Edit' : 'Reply'}
            </button>
        </div>
    );
};

export default Reply;
