import mongoose from 'mongoose';
import { Schema } from 'mongoose';


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    given_name: String,
    family_name: String,
    picture: String,
    communities: [{
        type: Schema.Types.ObjectId,
        ref: 'Community',
        default: []
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        default: []
    }],
    registered: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('User', userSchema);