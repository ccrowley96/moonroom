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
    posts: [{
        type: mongoose.Types.ObjectId,
        ref: 'Post',
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

// @ts-ignore
communitySchema.pre('deleteOne', { document: true }, async function(){
    const community = this;
    let userAndAdminIds = [...community.members, ...community.admins];

    // Remove all rooms with this community ID
    await community.model('Room').deleteMany({community: community._id})

    // Remove all posts with this community ID
    await community.model('Post').deleteMany({community: community._id})

    // Remove community ID from users with ID in their communities ref array
    await community.model('User').update({
        _id: {$in: userAndAdminIds}
    },
    {
        $pull: {
            communities: community._id
        }
    }, {multi: true})
})

const CommunityModel = mongoose.model('Community', communitySchema);
export default CommunityModel;