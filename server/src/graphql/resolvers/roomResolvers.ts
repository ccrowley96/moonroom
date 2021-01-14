export default {
    community: async (room) => {
        return (await room.populate('community').execPopulate()).community;
    }
};
