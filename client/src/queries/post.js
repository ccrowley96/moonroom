import { gql } from '@apollo/client';

export const postDataFragment = gql`
    fragment postData on Post {
        id
        title
        author {
            id
            given_name
        }
        room {
            id
            name
        }
        link
        date
        body
        rating
        tags
    }
`;

export const NEW_POST = gql`
    mutation addPost(
        $communityId: ID!
        $roomId: ID
        $title: String!
        $link: String
        $body: String
        $rating: Float
        $tags: [String]
    ) {
        addPost(
            communityId: $communityId
            roomId: $roomId
            title: $title
            link: $link
            body: $body
            rating: $rating
            tags: $tags
        ) {
            code
            success
            message
            post {
                ...postData
            }
        }
    }
    ${postDataFragment}
`;

export const EDIT_POST = gql`
    mutation editPost(
        $postId: ID!
        $communityId: ID!
        $roomId: ID
        $title: String!
        $link: String
        $body: String
        $rating: Float
        $tags: [String]
    ) {
        editPost(
            postId: $postId
            communityId: $communityId
            roomId: $roomId
            title: $title
            link: $link
            body: $body
            rating: $rating
            tags: $tags
        ) {
            code
            success
            message
            post {
                ...postData
            }
        }
    }
    ${postDataFragment}
`;

export const DELETE_POST = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId) {
            code
            success
            message
        }
    }
`;

export const POST_SEARCH = gql`
    query PostSearch($filter: String!) {
        post(filter: $filter) {
            ...postData
        }
    }
    ${postDataFragment}
`;
