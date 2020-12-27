import { gql } from 'apollo-server-express';

const typeDefs = gql`
   type User{
      id: ID
      name: String
      email: String
      given_name: String
      family_name: String
      picture: String
      communities: [Community]
      registered: String
   }

   type Post{
      title: String
      author: User
      link: String
      date: String
      body: String
      rating: Float
   }

   type Community{
      id: ID!
      name: String
      picture: String
      admins: [User]
      members: [User]
      rooms: [Room]
      description: String
      createdAt: String
   }

   type Room{
      id: ID!
      name: String
      posts: [Post]
      community: Community
      description: String
      createdAt: String
   }

   type Query {
      users: [User]!
      user(id: ID!): User
      me: User
      myCommunities: [Community]!
   }

   interface MutationResponse{
      code: String!
      success: Boolean!
      message: String!
   }

   type addCommunityMutationResponse implements MutationResponse{
      code: String!
      success: Boolean!
      message: String!
      community: Community
      user: User
   }

   type addRoomMutationResponse implements MutationResponse{
      code: String!
      success: Boolean!
      message: String!
      Room: Room
   }

   type addPostMutationResponse implements MutationResponse{
      code: String!
      success: Boolean!
      message: String!
      Post: Post
   }

   type Mutation{
      addCommunity(name: String!, picture: String, description: String): addCommunityMutationResponse
      addRoom(name: String!, community: ID!, description: String): addRoomMutationResponse
      addPost(title: String!, author: ID!, link: String, body: String, rating: Float): addPostMutationResponse
   }
`;

export default typeDefs;