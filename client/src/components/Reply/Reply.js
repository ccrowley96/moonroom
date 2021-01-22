import { useMutation } from '@apollo/client';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { enterPressed } from '../../services/utils';
const cx = classNames.bind(require('./Reply.module.scss'));

const Reply = () => {
    const [reply, setReply] = useState('');
    // const [sendReply] = useMutation();

    const handleSubmitReply = () => {};

    return (
        <div className={cx('replyForm')}>
            <input
                className={cx('_input', 'replyInput')}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyPress={(e) => enterPressed(e, handleSubmitReply)}
            ></input>
            <button className={cx('replyBtn')} onClick={handleSubmitReply}>
                Reply
            </button>
        </div>
    );
};

export default Reply;
