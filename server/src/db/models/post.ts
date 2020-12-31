import mongoose from 'mongoose';
import { User } from '../index'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    community: {
        type: mongoose.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    room: {
        type: mongoose.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    link: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    body: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: false
    }
})

postSchema.pre('remove', () => {
    // Remove post ref from Room

    // Remove post ref from User
})

export default mongoose.model('Post', postSchema);