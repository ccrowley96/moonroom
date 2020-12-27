import communityResolvers from './communityResolvers';
import userResolvers from './userResolvers';
import roomResolvers from './roomResolvers';

export default {
    Community: communityResolvers,
    User: userResolvers,
    Room: roomResolvers,
    Query: {
        me: async (_, __, { user }) => {
            return user
        },
        myCommunities: async (_, __, { dataSources: { communityApi } }) => {
           return await communityApi.getMyCommunities();
        },
        community: async (_, { communityId }, { dataSources: { communityApi } }) => {
            return await communityApi.getCommunity(communityId)
        },
        room: async (_, { communityId, roomId }, { dataSources: { roomApi } }) => {
            return await roomApi.getRoom(communityId, roomId)
        }
    },
    Mutation: {
        addCommunity: async(_, {name, picture, description}, { dataSources: { communityApi } }) => {
            return await communityApi.addCommunity(name, picture, description)
        },
        addRoom: async(_, {name, communityId, description}, { dataSources: { roomApi } }) => {
            return await roomApi.addRoom(name, communityId, description);
        }
    }
}