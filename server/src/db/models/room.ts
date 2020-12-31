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

roomSchema.pre('deleteOne', () => {
    // remove room ref from Community

    // remove all posts with room ref
})

roomSchema.pre('deleteMany', () => {
    // remove all posts with room ref
    console.log('trying to delete many rooms')
})

export default mongoose.model('Room', roomSchema);