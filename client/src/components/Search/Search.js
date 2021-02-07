import React from 'react';

import classNames from 'classnames/bind';
import { enterPressed } from '../../services/utils';
import { useAppState } from '../../hooks/provideAppState';
import { actionTypes } from '../../constants/constants';
import { useQuery, useReactiveVar } from '@apollo/client';
import { activeCommunityIdVar, activeRoomIdVar } from '../../cache';
import { GET_ACTIVE_COMMUNITY } from '../../queries/community';
const cx = classNames.bind(require('./Search.module.scss'));

const Search = ({
    searchFilter,
    setSearchFilter,
    feedSearch,
    fetchMoreNoCursor
}) => {
    const { appState, appDispatch } = useAppState();

    const activeRoomId = useReactiveVar(activeRoomIdVar);
    const activeCommunityId = useReactiveVar(activeCommunityIdVar);

    const { data: activeCommunityData } = useQuery(GET_ACTIVE_COMMUNITY, {
        variables: { communityId: activeCommunityId },
        skip: !activeCommunityId
    });

    const roomPlaceholder =
        activeRoomId && activeCommunityData?.community
            ? `Searching in ${
                  activeCommunityData?.community.rooms.find(
                      (room) => room.id === activeRoomId
                  ).name
              }...`
            : 'Searching all posts...';

    const handleSearchChange = (e) => {
        setSearchFilter(e.target.value);
        if (appState.tagSearch) {
            appDispatch({
                type: actionTypes.TAG_SEARCH,
                payload: null
            });
        }
        if (e.target.value === '') {
            appDispatch({
                type: actionTypes.SET_SEARCH_ACTIVE,
                payload: false
            });
            fetchMoreNoCursor();
        }
    };

    const handleSearchSubmit = () => {
        if (searchFilter !== '') {
            appDispatch({
                type: actionTypes.SET_SEARCH_ACTIVE,
                payload: true
            });
            feedSearch();
        } else {
            appDispatch({
                type: actionTypes.SET_SEARCH_ACTIVE,
                payload: false
            });
        }
    };

    return (
        <>
            <div className={cx('searchWrapper')}>
                <input
                    type="search"
                    className={cx('_input', 'searchBox')}
                    onChange={handleSearchChange}
                    placeholder={roomPlaceholder}
                    value={searchFilter}
                    onKeyPress={(e) => enterPressed(e, handleSearchSubmit)}
                />
                <button
                    className={cx('_btn', 'searchButton')}
                    onClick={handleSearchSubmit}
                >
                    OK
                </button>
            </div>
        </>
    );
};

export default Search;
