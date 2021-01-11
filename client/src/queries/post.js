import { gql } from '@apollo/client';

export const NEW_POST = gql`
    mutation addPost($communityId: ID!, $roomId: ID, $title: String!, $link: String, $body: String, $rating: Float, $tags: [String] ){
        addPost(communityId: $communityId, roomId: $roomId, title: $title, link: $link, body: $body, rating: $rating, tags: $tags){
            code
            success
            message
            post{
                id
                title
                author{
                    id
                    given_name
                }
                link
                date
                body
                rating
                tags
            }
        }
    }
`;

export const DELETE_POST = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId){
            code
            success
            message
        }
    }
`;