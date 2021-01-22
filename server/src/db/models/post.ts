import mongoose from 'mongoose';
import { User } from '../index';

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
        required: false
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
    },
    tags: [
        {
            type: String,
            required: false
        }
    ],
    comments: [
        {
            body: String,
            author: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
            editDate: {
                type: Date,
                required: false
            }
        }
    ]
});

// @ts-ignore
postSchema.pre('remove', { document: true }, async function () {
    const post = this;

    // Remove post ref from User posts
    await post.model('User').update(
        {
            _id: post.author
        },
        {
            $pull: {
                posts: post._id
            }
        },
        { multi: true }
    );

    // Remove post ref from Community posts
    await post.model('Community').update(
        {
            _id: post.community
        },
        {
            $pull: {
                posts: post._id
            }
        },
        { multi: true }
    );
});

export default mongoose.model('Post', postSchema);
