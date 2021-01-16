import React, { useEffect, useState } from 'react';
import { useLazyQuery, useReactiveVar } from '@apollo/client';
import { POST_SEARCH } from '../../queries/post';

import classNames from 'classnames/bind';
import { activeCommunityIdVar, activeRoomIdVar } from '../../cache';
const cx = classNames.bind(require('./Search.module.scss'));

const Search = ({ setActivePosts }) => {
    const [searchFilter, setSearchFilter] = useState('');
    const [executeSearch, { data }] = useLazyQuery(POST_SEARCH);
    const activeCommunityId = useReactiveVar(activeCommunityIdVar);
    const activeRoomId = useReactiveVar(activeRoomIdVar);

    const submitSearch = (customFilter = null) => {
        executeSearch({
            variables: {
                filter: customFilter !== null ? customFilter : searchFilter,
                communityId: activeCommunityId,
                ...(activeRoomId && { roomId: activeRoomId })
            }
        });
    };

    // Search for all posts on mount
    useEffect(() => {
        submitSearch();
    }, [activeRoomId]);

    const sortByDate = (posts) => {
        return posts.slice().sort((a, b) => Number(b.date) - Number(a.date));
    };

    // Pass data up through parent
    useEffect(() => {
        if (data) setActivePosts(sortByDate(data.postSearch));
    }, [data]);

    const handleSearchChange = (e) => {
        setSearchFilter(e.target.value);
        console.log(e.target.value);
        console.log(e.target.value === '');
        if (e.target.value === '') {
            // Re-query on empty search
            submitSearch('');
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
                />
                <button
                    className={cx('_btn', 'searchButton')}
                    onClick={(e) => submitSearch()}
                >
                    OK
                </button>
            </div>
        </>
    );
};

export default Search;
