import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
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
    
    const room = this;

    // remove room ref from Community
    await room.model('Community').update({
        _id: room.community
    },
    {
        $pull: {
            rooms: room._id
        }
    }, {multi: true})

    // remove room ref from all posts that reference it
    await room.model('Post').update({
        room: room._id
    },
    {
        $unset: {
            room: ""
        }
    }, {multi: true})

})

export default mongoose.model('Room', roomSchema);