import Mongoose from 'mongoose';

export const mongooseId = (id: string) => new Mongoose.Types.ObjectId(id);