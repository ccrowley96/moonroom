export default {
    community: async(room) => {
        return (await room.populate('community').execPopulate()).community
    },
    posts: async(community) => {
        return (await community.populate('posts').execPopulate()).posts
    }
}