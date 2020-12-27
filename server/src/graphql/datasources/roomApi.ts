import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Room } from '../../db/index';
import { ApolloError } from 'apollo-server-express';
import { errorCodes } from '../../constants/constants';

export default class roomApi<TData> extends MongoDataSource<TData>{
    async addRoom(name: String, communityId: String, description?: String){
        const { dataSources: {communityApi} } = this.context;
        try{
            // Verify community exists & user has access to community
            let community: any = await communityApi.getCommunity(communityId)
            if(!community)
                throw new ApolloError('You\'re trying to add a room to a community which does not exist', errorCodes.communityNotFound)

            // Populate rooms on community
            community = await community.populate('rooms').execPopulate();

            // Verify room name is unique
            community.rooms.forEach(room => {
                if(room.name === name)
                    throw new ApolloError('You already have a room with that name, please choose a unique name', errorCodes.roomAlreadyExists)
            })

            // Construct room object
            let room = new Room({
                name,
                community: community._id,
                description
            });

            // Save room
            let savedRoom = await room.save();

            // Add room ref to community object
            community.rooms.push(savedRoom._id);
            community.save();

            return {
                code: 200,
                success: true,
                message: 'Room created successfully!',
                room: savedRoom,
                community: community
            };
        }catch(err){
            return {
                code: 500,
                success: false,
                message: err.message,
                room: null,
                community: null
            }
        }
    }

    async getRoom(communityId: string, roomId: string){
        const { dataSources: {communityApi} } = this.context;

        try{
            // Ensure user has access to this room
            let community: any = await communityApi.getCommunity(communityId);

            // Populate rooms on community
            community = await community.populate('rooms').execPopulate();

            // Ensure room exists
            let roomIds = community.rooms.map(room => String(room._id))
            if(roomIds.indexOf(roomId) === -1){
                throw new ApolloError('Room does not exist!', errorCodes.roomNotFound)
            }

            // Return room
            return community.rooms.find(room => roomId === String(room._id))
        } catch(err){
            console.log(err);
            return null
        }
    }
}