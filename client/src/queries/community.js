import { gql } from '@apollo/client';

export const DELETE_COMMUNITY = gql`
    mutation deleteCommunity($communityId: ID!) {
        deleteCommunity(communityId: $communityId) {
            code
            success
            message
        }
    }
`;

export const LEAVE_COMMUNITY = gql`
    mutation leaveCommunity($communityId: ID!) {
        leaveCommunity(communityId: $communityId) {
            code
            success
            message
        }
    }
`;

export const GET_ACTIVE_COMMUNITY = gql`
    query getCommunity($communityId: ID!) {
        community(communityId: $communityId) {
            id
            code
            name
            picture
            admins {
                id
                name
                email
            }
            members {
                id
                name
                email
            }
            rooms {
                name
                id
            }
            description
            createdAt
        }
    }
`;

export const JOIN_COMMUNITY = gql`
    mutation joinCommunity($code: String!) {
        joinCommunity(code: $code) {
            code
            success
            message
            community {
                id
                name
            }
        }
    }
`;

export const CREATE_COMMUNITY = gql`
    mutation addNewCommunity($name: String!, $description: String) {
        addCommunity(name: $name, description: $description) {
            code
            success
            message
            community {
                id
                name
            }
        }
    }
`;

export const MY_COMMUNITIES = gql`
    query myCommunities {
        myCommunities {
            name
            id
        }
    }
`;
