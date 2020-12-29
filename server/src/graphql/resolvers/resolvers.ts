import communityResolvers from './communityResolvers';
import userResolvers from './userResolvers';
import roomResolvers from './roomResolvers';
import postResolvers from './postResolvers';

export default {
    Community: communityResolvers,
    User: userResolvers,
    Room: roomResolvers,
    Post: postResolvers,
    Query: {
        me: async (_, __, { user }) => {
            return user
        },
        myCommunities: async (_, __, { dataSources: { communityApi } }) => {
           return await communityApi.getMyCommunities();
        },
        community: async (_, { communityId }, { dataSources: { communityApi } }) => {
            return await communityApi.getCommunity(communityId);
        },
        room: async (_, { communityId, roomId }, { dataSources: { roomApi } }) => {
            return await roomApi.getRoom(communityId, roomId);
        },
        post: async (_, { postId }, { dataSources: { postApi } }) => {
            return await postApi.getPost(postId);
        }
    },
    Mutation: {
        addCommunity: async(_, {name, picture, description}, { dataSources: { communityApi } }) => {
            return await communityApi.addCommunity(name, picture, description);
        },
        addRoom: async(_, {name, communityId, description}, { dataSources: { roomApi } }) => {
            return await roomApi.addRoom(name, communityId, description);
        },
        addPost: async (_, {communityId, roomId, title, link, body, rating}, { dataSources: { postApi }}) => {
            return await postApi.addPost(communityId, roomId, title, link, body, rating);
        },
        joinCommunity: async (_, { code }, { dataSources: { communityApi }}) => {
            return await communityApi.joinCommunity(code);
        }
    }
}