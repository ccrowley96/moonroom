import { InMemoryCache, Reference, makeVar } from '@apollo/client'

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
                        return activeCommunity();
                    }
                },
                activeRoom: {
                    read() {
                        return activeRoom();
                    }
                }
            }
        }
    }
})

export const activeCommunityIdVar = makeVar(null);
export const activeRoomIdVar = makeVar(null);

export const activeCommunity = makeVar(null);
export const activeRoom = makeVar(null);