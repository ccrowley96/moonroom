import { InMemoryCache, makeVar } from '@apollo/client';

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
                feed: {
                    keyArgs: false,
                    merge(existing = null, incoming) {
                        let mergedEdges = [];
                        if (existing) {
                            mergedEdges = [...existing.edges];
                        }
                        mergedEdges = [...mergedEdges, ...incoming.edges];

                        console.log({
                            existing,
                            incoming,
                            merged: mergedEdges
                        });

                        return {
                            __typename: incoming.__typename,
                            edges: mergedEdges,
                            pageInfo: { ...incoming.pageInfo }
                        };
                    }
                }
            }
        }
    }
});

export const activeCommunityIdVar = makeVar(
    localStorage.getItem('activeCommunityId')
);
export const activeRoomIdVar = makeVar(null);
