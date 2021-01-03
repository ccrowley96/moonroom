import { gql } from '@apollo/client';

export const NEW_POST = gql`
    mutation addPost($communityId: ID!, $roomId: ID!, $title: String, $link: String, $body: String, $rating: Float, $tags: [String] ){
        addCommunity(communityId: $communityId, roomId: $roomId, title: $title, link: $link, body: $body, rating: $rating, tags: $tags){
            code
            success
            message
            post{
                id
                title
                author
                link
                date
                body
                rating
                tags
            }
        }
    }
`;