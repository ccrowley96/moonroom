import { gql } from '@apollo/client';

export const DELETE_ROOM = gql`
    mutation deleteRoom($communityId: ID!, $roomId: ID!) {
        deleteRoom(communityId: $communityId, roomId: $roomId) {
            code
            success
            message
        }
    }
`;

export const GET_ACTIVE_ROOM_ID_CLIENT = gql`
    query getActiveRoomId {
        activeRoomId @client
    }
`;

export const GET_ACTIVE_ROOM_CLIENT = gql`
    query getActiveRoom {
        activeRoom @client
    }
`;

export const GET_ACTIVE_ROOM = gql`
    query getRoom($communityId: ID!, $roomId: ID!) {
        room(communityId: $communityId, roomId: $roomId) {
            id
            name
            description
            createdAt
        }
    }
`;

export const CREATE_ROOM = gql`
    mutation addRoom($name: String!, $communityId: ID!, $description: String) {
        addRoom(
            name: $name
            communityId: $communityId
            description: $description
        ) {
            code
            success
            message
            room {
                id
                name
            }
        }
    }
`;
