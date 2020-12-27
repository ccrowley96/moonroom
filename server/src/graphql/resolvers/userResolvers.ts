export default {
    communities: async(user) => {
        return (await user.populate('communities').execPopulate()).communities;
    }
}