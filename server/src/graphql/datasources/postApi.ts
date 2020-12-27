import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Post } from '../../db/index';
import { ApolloError } from 'apollo-server-express';
import { errorCodes } from '../../constants/constants';
import { mongooseId } from '../../controllers/utils';


export default class postApi<TData> extends MongoDataSource<TData>{
    async addPost(communityId, roomId, title, link, body, rating){
        try{
            // Grab context variables
            const { user, dataSources: { roomApi } } = this.context;

            // Get room, verify room and community exist, and user is authorized to access
            let room = await roomApi.getRoom(communityId, roomId);

            // Create post object
            let post = new Post({
                title,
                link,
                body,
                rating,
                author: mongooseId(user._id),
                community: mongooseId(communityId),
                room: mongooseId(roomId)
            })

            await post.save();


            // Add post to room
            room.posts.push(mongooseId(post._id));
            await room.save();

            // Add post to user
            user.posts.push(mongooseId(post._id));
            await user.save();

            return {
                code: 200,
                success: true,
                message: 'Post created successfully',
                post: post,
                room: room
            }

        } catch(err){
            console.log(err)
            return {
                code: 500,
                success: false,
                message: err.message,
                post: null,
                room: null
            }
        }
    }
}