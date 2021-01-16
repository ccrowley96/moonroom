import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./Search.module.scss'));

const Search = () => {
    const [searchFilter, setSearchFilter] = useState('');

    return (
        <>
            <div className={cx('searchWrapper')}>
                <input
                    type="text"
                    className={cx('_input', 'searchBox')}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder={'Search...'}
                />
                <button className={cx('_btn', 'searchButton')}>OK</button>
            </div>
        </>
    );
};

export default Search;
