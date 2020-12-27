export default {
    Query: {
        users: async (_, __, { dataSources: { userApi } }) => {
            return await userApi.getAllUsers();
        },
        user: async (_, { id }, { dataSources: { userApi } }) =>{
            return await userApi.findUser(id)
        },
        me: async (_, __, { user }) => {
            return user
        },
        myCommunities: async (_, __, { user, dataSources: { communityApi } }) => {
           return await communityApi.getMyCommunities(user);
        }
    },
    Mutation: {
        addCommunity: async(_, {name, picture, description}, { user, dataSources: { communityApi } }) => {
            return await communityApi.addCommunity(name, user, picture, description)
        } 
    }
}