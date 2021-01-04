import { gql } from '@apollo/client';

export const authQuery = gql`
    query authState{
        auth
    }
`;