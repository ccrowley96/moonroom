import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post',
        required: false
    }],
    community: {
        type: mongoose.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    description: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// @ts-ignore
roomSchema.pre('deleteOne', { document: true }, async function() {
    // remove room ref from Community
    const room = this;

    // Remove community ID from users with ID in their communities ref array
    await room.model('Community').update({
        _id: room.community
    },
    {
        $pull: {
            rooms: room._id
        }
    }, {multi: true})

    // remove all posts with room ref
    await room.model('Post').deleteMany({room: room._id})

})

export default mongoose.model('Room', roomSchema);