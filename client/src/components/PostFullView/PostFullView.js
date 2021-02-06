import { useQuery } from '@apollo/client';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames/bind';
import { GET_POST } from '../../queries/post';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
const cx = classNames.bind(require('./PostFullView.module.scss'));

const PostFullView = () => {
    const { id } = useParams();
    const history = useHistory();
    // Query for post
    const { loading, data, error } = useQuery(GET_POST, {
        variables: { postId: id }
    });
    const [copied, setCopied] = useState(false);

    console.log(data);

    useEffect(() => {
        let timeout = null;
        if (copied) {
            timeout = setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
        return () => clearTimeout(timeout);
    }, [copied]);

    return (
        <div className={cx('postWrapper')}>
            <div className={cx('postNav')}>
                <div className={cx('copyBtn')}>
                    <CopyToClipboard
                        text={window.location}
                        onCopy={() => setCopied(true)}
                    >
                        <button className={cx('_btn')}>Copy post link</button>
                    </CopyToClipboard>
                    <div className={cx('clickInfo')}>
                        {copied ? 'Post link copied...' : ''}
                    </div>
                </div>
                <button
                    className={cx('_btn')}
                    onClick={() => history.push('/')}
                >
                    Home
                </button>
            </div>
            {loading ? (
                <div className={cx('loading')}>Loading...</div>
            ) : (
                <div className={cx('post')}></div>
            )}
        </div>
    );
};

export default PostFullView;
