import { activeCommunityIdVar, activeRoomIdVar, cache } from '../cache';
import { GET_ACTIVE_COMMUNITY, MY_COMMUNITIES } from '../queries/community';
import { POSTS_PER_PAGE } from '../constants/constants';

export const enterPressed = (e, targetFunc) => {
    let code = e.keyCode || e.which;
    if (code === 13) {
        targetFunc();
    }
};

export const selectCommunity = (communityId) => {
    localStorage.setItem('activeCommunityId', communityId);
    activeCommunityIdVar(communityId);
    activeRoomIdVar(null);
};

export const removeCommunityFromCache = (communityId) => {
    if (communityId) {
        // Remove cached GET_ACTIVE_COMMUNITY entry for communityId
        cache.writeQuery({
            query: GET_ACTIVE_COMMUNITY,
            variables: { communityId },
            data: { community: null }
        });

        // Remove communityId from MY_COMMUNITIES cache
        // Read my communities
        let communitiesData = cache.readQuery({
            query: MY_COMMUNITIES
        });

        // Filter out deleted community
        const newCommunities = communitiesData?.myCommunities.filter(
            (community) => community.id !== communityId
        );

        cache.writeQuery({
            query: MY_COMMUNITIES,
            data: { myCommunities: newCommunities }
        });
    }
};

export const isValidURL = (str) => {
    let url;
    try {
        url = new URL(str);
    } catch (_) {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:'
        ? url.href
        : false;
};

export const getFeedQueryVariables = (
    communityId,
    cursor,
    first = POSTS_PER_PAGE
) => {
    return {
        communityId,
        first,
        after: cursor
    };
};

export const getFeedSearchVariables = (
    communityId,
    filter = '',
    cursor,
    first = POSTS_PER_PAGE
) => {
    return {
        communityId,
        first,
        after: cursor,
        filter
    };
};
