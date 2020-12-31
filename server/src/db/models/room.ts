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

    // remove all posts with room ref
})

export default mongoose.model('Room', roomSchema);