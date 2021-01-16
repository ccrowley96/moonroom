import React from 'react';

import classNames from 'classnames/bind';
const cx = classNames.bind(require('./Search.module.scss'));

const Search = ({ searchFilter, setSearchFilter, fetchFeed }) => {
    const handleSearchChange = (e) => {
        setSearchFilter(e.target.value);
        if (e.target.value === '') {
            // Re-query on empty search
            fetchFeed();
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
                />
                <button
                    className={cx('_btn', 'searchButton')}
                    onClick={(e) => fetchFeed()}
                >
                    OK
                </button>
            </div>
        </>
    );
};

export default Search;
