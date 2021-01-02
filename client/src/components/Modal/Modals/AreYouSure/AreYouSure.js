import React, { useState } from 'react';
import { USER_QUERY } from '../../../../queries/profile';
import { useQuery } from '@apollo/client';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./AreYouSure.module.scss'));

const AreYouSure = ({ mutation, buttonText, placeholder, confirmText, dangerText, activeCommunity}) => {
    const { data: userData } = useQuery(USER_QUERY);
    const [ areYouSureInput, setAreYouSureInput] = useState('');

    if(userData && userData.me && activeCommunity.admins.find(admin => admin.id === userData.me.id)){
        return(
            <div className={cx('_modalSection')}>
                <div className={cx('_sectionLabel')}>Admin</div>
                <div className={cx('deleteContainer')}>
                    <div className={cx('_sectionValue', '_danger')}>{dangerText}</div>
                    <input
                        placeholder={placeholder}
                        value={areYouSureInput}
                        onChange={(e) => setAreYouSureInput(e.target.value)}
                        className={cx('confirmInput')}
                    />
                    <button className={cx('_btn-danger', 'deleteBtn')} onClick={mutation} disabled={areYouSureInput !== confirmText}>
                        {buttonText}
                    </button>
                </div>
            </div>    
        );
    } else{
        return null;
    }
}

export default AreYouSure;