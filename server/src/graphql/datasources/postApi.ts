import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Post } from '../../db/index';
import { ApolloError } from 'apollo-server-express';
import { errorCodes } from '../../constants/constants';
import { mongooseId } from '../../controllers/utils';
import escape from 'escape-regexp';

export default class postApi<TData> extends MongoDataSource<TData> {
    // First === limit, after === cursor ID
    async feedQuery(communityId, roomId, filter, first, after) {
        const searchQuery =
            filter && filter !== ''
                ? {
                      $and: [
                          {
                              community: mongooseId(communityId),
                              ...(roomId && { room: mongooseId(roomId) }),
                              ...(after && {
                                  date: {
                                      $lt: new Date(Number(after)).toISOString()
                                  }
                              })
                          },
                          {
                              $or: [
                                  {
                                      title: {
                                          $regex: escape(filter),
                                          $options: 'i'
                                      }
                                  },
                                  {
                                      body: {
                                          $regex: escape(filter),
                                          $options: 'i'
                                      }
                                  },
                                  {
                                      link: {
                                          $regex: escape(filter),
                                          $options: 'i'
                                      }
                                  },
                                  {
                                      tags: {
                                          $regex: escape(filter),
                                          $options: 'i'
                                      }
                                  }
                              ]
                          }
                      ]
                  }
                : {
                      community: mongooseId(communityId),
                      ...(roomId && { room: mongooseId(roomId) }),
                      ...(after && {
                          date: { $lt: new Date(Number(after)).toISOString() }
                      })
                  };

        const count = await Post.countDocuments(searchQuery);

        let postsFound: any = await Post.find(searchQuery)
            .limit(first)
            .sort({ date: 'descending' });

        const feedEdges = postsFound.map((doc: any) => ({
            cursor: doc.date,
            node: doc
        }));

        return {
            edges: feedEdges,
            pageInfo: {
                hasNextPage: count > feedEdges.length
            }
        };
    }

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

    async editPost(
        postId,
        communityId,
        roomId,
        title,
        link,
        body,
        rating,
        tags
    ) {
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

            // Verify post exists
            let post: any = await Post.findById({ _id: mongooseId(postId) });
            if (!post) {
                throw new ApolloError(
                    'Post does not exist!',
                    errorCodes.postNotFound
                );
            }

            // Update post fields
            post.title = title;
            post.link = link;
            post.body = body;
            post.rating = rating;
            post.room = room ? mongooseId(roomId) : null;
            post.tags = tags;

            await post.save();

            return {
                code: 200,
                success: true,
                message: 'Post updated successfully',
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
