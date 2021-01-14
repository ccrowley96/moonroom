import { gql } from '@apollo/client';

export const USER_QUERY = gql`
    query getUser {
        me {
            id
            name
            email
            given_name
            family_name
            picture
            registered
        }
    }
`;
