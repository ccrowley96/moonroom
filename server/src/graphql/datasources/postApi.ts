import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Post, Community } from '../../db/index';
import { ApolloError } from 'apollo-server-express';
import { errorCodes } from '../../constants/constants';
import { mongooseId } from '../../controllers/utils';

export default class postApi<TData> extends MongoDataSource<TData> {
    async addPost(communityId, roomId, title, link, body, rating, tags) {
        try {
            // Grab context variables
            const {
                user,
                dataSources: { roomApi, communityApi }
            } = this.context;

            // Verify community exists and user has access
            let community = await communityApi.getCommunity(communityId);
            let room = null;

            if (roomId) {
                // Verify rooms exists
                room = await roomApi.getRoom(communityId, roomId);
            }

            // Create post object
            let post = new Post({
                title,
                link,
                body,
                rating,
                author: mongooseId(user._id),
                community: mongooseId(communityId),
                room: room ? mongooseId(roomId) : null,
                tags
            });

            await post.save();

            // Add post to community
            community.posts.push(mongooseId(post._id));
            await community.save();

            // Add post to user
            user.posts.push(mongooseId(post._id));
            await user.save();

            return {
                code: 200,
                success: true,
                message: 'Post created successfully',
                post: post
            };
        } catch (err) {
            console.log(err);
            return {
                code: 500,
                success: false,
                message: err.message,
                post: null,
                room: null
            };
        }
    }

    async deletePost(postId: string) {
        const { user } = this.context;

        try {
            // Ensure user is either author of post or admin of community
            let post: any = await Post.findById({ _id: mongooseId(postId) });
            if (!post)
                throw new ApolloError(
                    'Post does not exist!',
                    errorCodes.postNotFound
                );

            post = await post.populate('community').execPopulate();

            let authorizedToDeleteIds = [
                ...post.community.admins.map((m) => String(m)),
                String(post.author)
            ];

            if (authorizedToDeleteIds.indexOf(String(user._id)) === -1) {
                throw new Error('You are not authorized to delete this post');
            }

            // Delete post
            let toDelete = await Post.findById({ _id: mongooseId(postId) });
            await toDelete.deleteOne();

            return {
                code: 200,
                success: true,
                message: 'Post deleted.'
            };
        } catch (err) {
            return {
                code: 500,
                success: false,
                message: err
            };
        }
    }

    async getPost(postId: string) {
        const {
            dataSources: { communityApi }
        } = this.context;

        // Query post
        let post: any = await Post.findById({ _id: mongooseId(postId) });
        if (!post)
            throw new ApolloError(
                'Post does not exist!',
                errorCodes.postNotFound
            );

        // Check that user has access to the community
        post = await post.populate('community');
        let communityId = post.community._id;
        await communityApi.verifyAccessToCommunity(communityId);

        // Return post
        return post;
    }
}
