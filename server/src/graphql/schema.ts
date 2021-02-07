import { gql } from 'apollo-server-express';

const typeDefs = gql`
    type User {
        id: ID!
        name: String
        email: String
        given_name: String
        family_name: String
        picture: String
        communities: [Community]
        posts: [Post]
        registered: String
    }

    type Post {
        id: ID!
        title: String
        author: User
        community: Community
        sourcePost: Post
        room: Room
        link: String
        date: String
        body: String
        rating: Float
        tags: [String]
        comments: [Comment]
    }

    type Comment {
        id: ID!
        body: String
        author: User
        date: String
        editDate: String
    }

    type Community {
        id: ID!
        code: String!
        name: String
        picture: String
        admins: [User]
        members: [User]
        rooms: [Room]
        posts: [Post]
        description: String
        createdAt: String
    }

    type Room {
        id: ID!
        name: String
        community: Community
        description: String
        createdAt: String
    }

    type PageInfo {
        hasNextPage: Boolean
    }

    type FeedEdge {
        cursor: ID
        node: Post
    }

    type FeedConnection {
        edges: [FeedEdge]
        pageInfo: PageInfo!
    }

    type Query {
        me: User
        myCommunities: [Community]!
        community(communityId: ID!): Community
        room(communityId: ID!, roomId: ID!): Room
        post(postId: ID!): Post
        feed(
            communityId: ID!
            roomId: ID
            first: Int
            after: String
        ): FeedConnection
        feedSearch(
            communityId: ID!
            roomId: ID
            filter: String
            first: Int
            after: String
        ): FeedConnection
    }

    interface MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }

    type deleteMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
    }

    type deleteCommentResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        post: Post
    }

    type addCommunityMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        community: Community
        user: User
    }

    type joinCommunityMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        community: Community
        user: User
    }

    type addRoomMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        room: Room
        community: Community
    }

    type addEditPostMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        post: Post
    }

    type crossPostMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        post: Post
    }

    type addEditCommentMutationResponse implements MutationResponse {
        code: String!
        success: Boolean!
        message: String!
        post: Post
    }

    type Mutation {
        addCommunity(
            name: String!
            picture: String
            description: String
        ): addCommunityMutationResponse
        addRoom(
            name: String!
            communityId: ID!
            description: String
        ): addRoomMutationResponse
        addPost(
            communityId: ID!
            roomId: ID
            title: String!
            link: String
            body: String
            rating: Float
            tags: [String]
        ): addEditPostMutationResponse
        crossPost(
            postId: ID!
            communityId: ID!
            roomId: ID
        ): crossPostMutationResponse
        editPost(
            postId: ID!
            communityId: ID!
            roomId: ID
            title: String!
            link: String
            body: String
            rating: Float
            tags: [String]
        ): addEditPostMutationResponse
        addComment(
            postId: ID!
            communityId: ID!
            body: String
        ): addEditCommentMutationResponse
        editComment(
            postId: ID!
            communityId: ID!
            commentId: ID!
            body: String
        ): addEditCommentMutationResponse
        joinCommunity(code: String!): joinCommunityMutationResponse
        deleteCommunity(communityId: ID!): deleteMutationResponse
        deleteRoom(communityId: ID!, roomId: ID!): deleteMutationResponse
        deletePost(postId: ID!): deleteMutationResponse
        deleteComment(postId: ID!, commentId: ID!): deleteCommentResponse
        leaveCommunity(communityId: ID!): deleteMutationResponse
    }
`;

export default typeDefs;
