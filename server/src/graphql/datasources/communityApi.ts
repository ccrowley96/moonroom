import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Community, User } from '../../db/index';
import Mongoose from 'mongoose';
import { mongooseId } from '../../controllers/utils';
import { ApolloError } from 'apollo-server-express';
import { errorCodes } from '../../constants/constants';

class CommunityApi<TData> extends MongoDataSource<TData>{

    async addCommunity(name: String, user: any, picture?: String, description?: String){
        try{
            // Only add community if user doesn't already own a community with the same name
            let communityOwner: any = await User.findById({_id: mongooseId(user._id)}).populate('communities');
            communityOwner.communities.forEach(community => {
                if(community.name === name)
                    throw new ApolloError('You already have a community with that name, please choose a unique name', errorCodes.communityAlreadyExists)
            })

            // Construct community object
            let community = new Community({
                name,
                admins: [mongooseId(user._id)],
                picture,
                description
            });

            // Save community
            let savedCommunity = await community.save();

            // Add community ref to user object
            communityOwner.communities.push(savedCommunity._id);
            communityOwner = communityOwner.save();

            // Query saved community and populate 'admins' field
            let populatedCommunity = await Community.findById(savedCommunity._id).populate('admins');

            return {
                code: 200,
                success: true,
                message: 'Community created successfully!',
                community: populatedCommunity,
                user: communityOwner
            };
        }catch(err){
            return {
                code: 500,
                success: false,
                message: err.message,
                community: null,
                user: null
            }
        }
    }

    async getMyCommunities(user: any){
        let userQuery: any = await User.findById({_id: mongooseId(user._id)}).populate('communities');
        return userQuery.communities;
    }
}

export default CommunityApi;