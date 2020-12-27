export default {
    community: async(post) => {
        return (await post.populate('community').execPopulate()).community
    },
    room: async(post) => {
        return (await post.populate('posts').execPopulate()).posts
    }
}