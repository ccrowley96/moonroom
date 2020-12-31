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

communitySchema.post('findOneAndDelete', async function(doc){

    console.log('Post community findOneAndDelete middleware');
    console.log(doc);
    // let roomIds = []

    // // Remove all rooms in community
    // await community.model('Room').deleteMany({
    //     _id: {
    //         $in: roomIds
    //     }
    // })

    // remove community ref from all admins

    // remove community ref from all users
})

const CommunityModel = mongoose.model('Community', communitySchema);
export default CommunityModel;