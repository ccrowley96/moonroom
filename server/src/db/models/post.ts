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

export default mongoose.model('Post', postSchema);