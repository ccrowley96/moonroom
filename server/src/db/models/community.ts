import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    code: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: false
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    rooms: [{
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: false
    }],
    description: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Community', communitySchema);