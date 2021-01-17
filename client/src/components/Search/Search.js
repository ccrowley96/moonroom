import React from 'react';

import classNames from 'classnames/bind';
import { enterPressed } from '../../services/utils';
const cx = classNames.bind(require('./Search.module.scss'));

const Search = ({ searchFilter, setSearchFilter, feedSearch }) => {
    const handleSearchChange = (e) => {
        setSearchFilter(e.target.value);
        if (e.target.value === '') {
            // Re-query on empty search
            feedSearch();
        }
    };

    return (
        <>
            <div className={cx('searchWrapper')}>
                <input
                    type="text"
                    className={cx('_input', 'searchBox')}
                    onChange={handleSearchChange}
                    placeholder={'Search...'}
                    value={searchFilter}
                    onKeyPress={(e) => enterPressed(e, feedSearch)}
                />
                <button
                    className={cx('_btn', 'searchButton')}
                    onClick={(e) => feedSearch()}
                >
                    OK
                </button>
            </div>
        </>
    );
};

export default Search;
