import { gql } from '@apollo/client';

export const GET_ACTIVE_COMMUNITY_ID_CLIENT = gql`
    query getActiveCommunityId{
        activeCommunityId @client
    }
`;

export const GET_ACTIVE_COMMUNITY_CLIENT = gql`
    query getActiveCommunity{
        activeCommunity @client
    }
`

export const GET_ACTIVE_COMMUNITY = gql`
    query getCommunity($communityId: ID!){
        community(communityId: $communityId){
            id
            code
            name
            picture
            admins{
                id
                name
                email
            }
            members{
                name
                email
            }
            rooms{
                name
                id
            }
            description
            createdAt
        }
    }
`;

export const JOIN_COMMUNITY = gql`
    mutation joinCommunity($code: String!){
        joinCommunity(code: $code){
            code
            success
            message
            community{
                name
            }
        }
    }
`;

export const CREATE_COMMUNITY = gql`
    mutation addNewCommunity($name: String!, $description: String){
        addCommunity(name: $name, description: $description){
            code
            success
            message
            community{
                id
                name
            }
        }
    }
`;

export const MY_COMMUNITIES = gql`
    query myCommunities{
        myCommunities{
            name
            id
        }
    }
`;