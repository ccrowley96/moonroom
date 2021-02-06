export default {
    community: async (post) => {
        return (await post.populate('community').execPopulate()).community;
    },
    room: async (post) => {
        return (await post.populate('room').execPopulate()).room;
    },
    author: async (post) => {
        return (await post.populate('author').execPopulate()).author;
    },
    sourcePost: async (post) => {
        return (await post.populate('sourcePost').execPopulate()).sourcePost;
    }
};
