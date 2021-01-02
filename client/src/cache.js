import { InMemoryCache, makeVar } from '@apollo/client'

export const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                activeCommunityId: {
                    read() {
                        return activeCommunityIdVar();
                    }
                },
                activeRoomId: {
                    read() {
                        return activeRoomIdVar();
                    }
                },
                activeCommunity: {
                    read() {
                        return activeCommunityVar();
                    }
                }
            }
        }
    }
})

export const activeCommunityIdVar = makeVar(null);
export const activeRoomIdVar = makeVar(null);
export const activeCommunityVar = makeVar(null);