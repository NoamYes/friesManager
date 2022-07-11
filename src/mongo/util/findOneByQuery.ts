import mongoose from 'mongoose';

export default async (model: mongoose.Model<T>, query: any) => {
    return await model.findOne(query);
};
