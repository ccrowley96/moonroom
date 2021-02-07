import communityResolvers from './communityResolvers';
import userResolvers from './userResolvers';
import roomResolvers from './roomResolvers';
import postResolvers from './postResolvers';
import commentResolvers from './commentResolvers';

export default {
    Community: communityResolvers,
    User: userResolvers,
    Room: roomResolvers,
    Post: postResolvers,
    Comment: commentResolvers,
    Query: {
        me: async (_, __, { user }) => {
            return user;
        },
        myCommunities: async (_, __, { dataSources: { communityApi } }) => {
            return await communityApi.getMyCommunities();
        },
        community: async (
            _,
            { communityId },
            { dataSources: { communityApi } }
        ) => {
            return await communityApi.getCommunity(communityId);
        },
        room: async (
            _,
            { communityId, roomId },
            { dataSources: { roomApi } }
        ) => {
            return await roomApi.getRoom(communityId, roomId);
        },
        post: async (_, { postId }, { dataSources: { postApi } }) => {
            return await postApi.getPost(postId);
        },
        feed: async (
            _,
            { communityId, roomId, first = 5, after },
            { dataSources: { postApi } }
        ) => {
            return await postApi.feedQuery(communityId, roomId, first, after);
        },
        feedSearch: async (
            _,
            { communityId, roomId, filter, first = 5, after },
            { dataSources: { postApi } }
        ) => {
            return await postApi.feedSearch(
                communityId,
                roomId,
                filter,
                first,
                after
            );
        }
    },
    Mutation: {
        addCommunity: async (
            _,
            { name, picture, description },
            { dataSources: { communityApi } }
        ) => {
            return await communityApi.addCommunity(name, picture, description);
        },
        addRoom: async (
            _,
            { name, communityId, description },
            { dataSources: { roomApi } }
        ) => {
            return await roomApi.addRoom(name, communityId, description);
        },
        addPost: async (
            _,
            { communityId, roomId, title, link, body, rating, tags },
            { dataSources: { postApi } }
        ) => {
            return await postApi.addPost(
                communityId,
                roomId,
                title,
                link,
                body,
                rating,
                tags
            );
        },
        crossPost: async (
            _,
            { postId, communityId, roomId },
            { dataSources: { postApi } }
        ) => {
            return await postApi.crossPost(postId, communityId, roomId);
        },
        editPost: async (
            _,
            { postId, communityId, roomId, title, link, body, rating, tags },
            { dataSources: { postApi } }
        ) => {
            return await postApi.editPost(
                postId,
                communityId,
                roomId,
                title,
                link,
                body,
                rating,
                tags
            );
        },
        addComment: async (
            _,
            { postId, communityId, body },
            { dataSources: { postApi } }
        ) => {
            return await postApi.addComment(postId, communityId, body);
        },
        editComment: async (
            _,
            { postId, communityId, commentId, body },
            { dataSources: { postApi } }
        ) => {
            return await postApi.editComment(
                postId,
                communityId,
                commentId,
                body
            );
        },
        joinCommunity: async (
            _,
            { code },
            { dataSources: { communityApi } }
        ) => {
            return await communityApi.joinCommunity(code);
        },
        deleteCommunity: async (
            _,
            { communityId },
            { dataSources: { communityApi } }
        ) => {
            return await communityApi.deleteCommunity(communityId);
        },
        deleteRoom: async (
            _,
            { communityId, roomId },
            { dataSources: { roomApi } }
        ) => {
            return await roomApi.deleteRoom(communityId, roomId);
        },
        deletePost: async (_, { postId }, { dataSources: { postApi } }) => {
            return await postApi.deletePost(postId);
        },
        deleteComment: async (
            _,
            { postId, commentId },
            { dataSources: { postApi } }
        ) => {
            return await postApi.deleteComment(postId, commentId);
        },
        leaveCommunity: async (
            _,
            { communityId },
            { dataSources: { communityApi } }
        ) => {
            return await communityApi.leaveCommunity(communityId);
        }
    }
};
