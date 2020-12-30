import { gql } from '@apollo/client';

export const CREATE_ROOM = gql`
    mutation addRoom($name: String!, $communityId: ID! $description: String){
        addRoom(name: $name, communityId: $communityId, description: $description){
            code
            success
            message
            room{
                id
                name
            }
        }
    }
`;