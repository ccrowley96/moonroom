export default {
    communities: async(user) => {
        return (await user.populate('communities').execPopulate()).communities;
    },
    posts: async(user) => {
        return (await user.populate('posts').execPopulate()).posts;
    }
}