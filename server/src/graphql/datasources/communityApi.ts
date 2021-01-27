import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Community, User } from '../../db/index';
import { mongooseId } from '../../controllers/utils';
import { ApolloError } from 'apollo-server-express';
import { errorCodes } from '../../constants/constants';
import randomstring from 'randomstring';

class CommunityApi<TData> extends MongoDataSource<TData> {
    async addCommunity(name: String, picture?: String, description?: String) {
        const { user } = this.context;
        try {
            // Only add community if user doesn't already own a community with the same name
            let communityOwner: any = await User.findById({
                _id: mongooseId(user._id)
            }).populate('communities');
            communityOwner.communities.forEach((community) => {
                if (community.name === name)
                    throw new ApolloError(
                        'You already have a community with that name, please choose a unique name',
                        errorCodes.communityAlreadyExists
                    );
            });

            // Generate unique community code
            // Find unique room code
            let communityCodeCheck = null;
            let communityCode = null;
            do {
                communityCode = randomstring
                    .generate({
                        length: 6,
                        charset: 'alphabetic',
                        readable: true,
                        capitalization: 'lowercase'
                    })
                    .toLowerCase();
                communityCodeCheck = await Community.find({
                    code: communityCode
                });
            } while (communityCodeCheck.length !== 0);

            // Construct community object
            let community = new Community({
                name,
                code: communityCode,
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
        } catch (err) {
            return {
                code: 500,
                success: false,
                message: err.message,
                community: null,
                user: null
            };
        }
    }

    async getMyCommunities() {
        const { user } = this.context;
        let userQuery: any = await User.findById({
            _id: mongooseId(user._id)
        }).populate('communities');
        return userQuery.communities;
    }

    async verifyCommunityExists(communityId?: string, communityCode?: string) {
        let community;

        // Verify community exists; lookup using either communityCode or communityId
        if (communityCode) {
            community = await Community.findOne({ code: communityCode });
        } else {
            community = await Community.findById({
                _id: mongooseId(communityId)
            });
        }

        if (!community) {
            throw new ApolloError(
                'Community does not exist',
                errorCodes.communityNotFound
            );
        }

        return community;
    }

    async verifyAccessToCommunity(communityId: string) {
        let community = await this.verifyCommunityExists(communityId);

        // Verify access to community
        let myCommunitiesIds = (
            await this.getMyCommunities()
        ).map((community) => String(community.id));
        if (myCommunitiesIds.indexOf(communityId) === -1) {
            throw new ApolloError(
                "You don't have access to this community!",
                errorCodes.communityUnauthorized
            );
        }

        return community;
    }

    async getCommunity(communityId: string) {
        return await this.verifyAccessToCommunity(communityId);
    }

    async joinCommunity(code: string) {
        const { user } = this.context;

        try {
            // Verify community with given code exists
            let community: any = await this.verifyCommunityExists(null, code);

            // Populate members and admins
            community = await community.populate('members').populate('admins');

            // Make sure user hasn't already joined community and is not an admin
            let membersAndAdmins = [
                ...community.members.map((m) => String(m)),
                ...community.admins.map((a) => String(a))
            ];
            if (membersAndAdmins.indexOf(String(user._id)) !== -1) {
                throw new ApolloError(
                    'You are already a member or admin of this community',
                    errorCodes.communityAlreadyJoined
                );
            }

            //  Add user to community
            community.members.push(mongooseId(user._id));
            let savedCommunity = await community.save();

            // Add community ref to user
            user.communities.push(mongooseId(community._id));
            let savedUser = await user.save();

            return {
                code: 200,
                success: true,
                message: 'Community joined!',
                community: savedCommunity,
                user: savedUser
            };
        } catch (err) {
            return {
                code: 500,
                success: false,
                message: err,
                community: null,
                user: null
            };
        }
    }

    async deleteCommunity(communityId: string) {
        const { user } = this.context;
        try {
            // Verify community exists
            let community: any = await this.verifyCommunityExists(communityId);

            // Populate admins
            community = await community.populate('admins');

            // Verify user is admin of community
            if (community.admins.indexOf(user._id) === -1)
                throw new Error(
                    'You are not authorized to delete this community'
                );

            // Delete community
            let toDelete = await Community.findById({
                _id: mongooseId(communityId)
            });
            await toDelete.deleteOne();

            return {
                code: 200,
                success: true,
                message: 'Community deleted.'
            };
        } catch (err) {
            return {
                code: 500,
                success: false,
                message: err
            };
        }
    }

    async leaveCommunity(communityId: string) {
        const { user } = this.context;
        try {
            // Verify community exists
            let community: any = await this.verifyCommunityExists(communityId);

            // Populate members admins
            community = await community.populate('members').populate('admins');

            // Verify user is member of community
            if (community.members.indexOf(user._id) === -1)
                throw new Error('You are not a member of this community');

            // Verify user is not an admin of community
            if (community.admins.indexOf(user._id) !== -1)
                throw new Error('Admins cannot leave their community');

            // Remove community from user's community list
            await User.updateOne(
                {
                    _id: user._id
                },
                {
                    $pull: {
                        communities: community._id
                    }
                }
            );

            // Remove user from community member's list
            await Community.updateOne(
                {
                    _id: community._id
                },
                {
                    $pull: {
                        members: user._id
                    }
                }
            );

            return {
                code: 200,
                success: true,
                message: 'Community left'
            };
        } catch (err) {
            return {
                code: 500,
                success: false,
                message: err
            };
        }
    }
}

export default CommunityApi;
