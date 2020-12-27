import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Community, User } from '../../db/index';
import Mongoose from 'mongoose';
import { mongooseId } from '../../controllers/utils';
import { ApolloError } from 'apollo-server-express';
import { errorCodes } from '../../constants/constants';

class CommunityApi<TData> extends MongoDataSource<TData>{
    async addCommunity(name: String, picture?: String, description?: String){
        const { user } = this.context;
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

            return {
                code: 200,
                success: true,
                message: 'Community created successfully!',
                community: savedCommunity,
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

    async getMyCommunities(){
        const { user } = this.context;
        let userQuery: any = await User.findById({_id: mongooseId(user._id)}).populate('communities');
        return userQuery.communities;
    }

    async getCommunity(communityId: string){
        // Ensure user has access to this community
        let myCommunitiesIds = (await this.getMyCommunities()).map(community => String(community.id));
        if(myCommunitiesIds.indexOf(communityId) === -1){
            throw new ApolloError('You don\'t have access to this community!', errorCodes.communityUnauthorized)
        }

        return await Community.findById({_id: mongooseId(communityId)})
    }
}

export default CommunityApi;