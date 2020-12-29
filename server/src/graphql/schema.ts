import { gql } from 'apollo-server-express';

const typeDefs = gql`
   type User{
      id: ID!
      name: String
      email: String
      given_name: String
      family_name: String
      picture: String
      communities: [Community]
      registered: String
   }

   type Post{
      id: ID!
      title: String
      author: User
      community: Community
      room: Room
      link: String
      date: String
      body: String
      rating: Float
   }

   type Community{
      id: ID!
      code: String!
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
      me: User
      myCommunities: [Community]!
      community(communityId: ID!): Community
      room(communityId: ID!, roomId: ID!): Room
      post(postId: ID!): Post
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

   type joinCommunityMutationResponse implements MutationResponse{
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
      room: Room
      community: Community
   }

   type addPostMutationResponse implements MutationResponse{
      code: String!
      success: Boolean!
      message: String!
      post: Post
      room: Room
   }

   type Mutation{
      addCommunity(name: String!, picture: String, description: String): addCommunityMutationResponse
      addRoom(name: String!, communityId: ID!, description: String): addRoomMutationResponse
      addPost(communityId: ID!, roomId: ID!, title: String!, link: String, body: String, rating: Float): addPostMutationResponse
      joinCommunity(code: String!): joinCommunityMutationResponse
   }
`;

export default typeDefs;