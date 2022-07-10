import * as mongoose from 'mongoose';

export default () => {
    return mongoose.connection.readyState === 1;
};
