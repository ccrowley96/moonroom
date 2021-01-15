import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FiLink } from 'react-icons/fi';

import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
const cx = classNames.bind(require('./CommunityCodeLink.module.scss'));

const CommunityCodeLink = ({ code }) => {
    const [copied, setCopied] = useState(false);

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
        <div className={cx('codeLinkWrapper')}>
            <CopyToClipboard
                text={`${window.location.origin}/community/${code}`}
                onCopy={() => setCopied(true)}
            >
                <div className={cx('copyWrapper')}>
                    <div className={cx('linkLine')}>
                        <span className={cx('codeTitle')}>Unique code:</span>
                        <span className={cx('code')}>{code}</span>
                        <FiLink className="linkIcon" />
                    </div>
                    <div className={cx('clickInfo')}>
                        {copied
                            ? 'link copied to clipboard...'
                            : '(click to copy join-community link)'}
                    </div>
                </div>
            </CopyToClipboard>
        </div>
    );
};

export default CommunityCodeLink;
