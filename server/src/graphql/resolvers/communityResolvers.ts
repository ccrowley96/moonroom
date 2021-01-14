export default {
    admins: async (community) => {
        return (await community.populate('admins').execPopulate()).admins;
    },
    members: async (community) => {
        return (await community.populate('members').execPopulate()).members;
    },
    rooms: async (community) => {
        return (await community.populate('rooms').execPopulate()).rooms;
    },
    posts: async (community) => {
        return (await community.populate('posts').execPopulate()).posts;
    }
};
