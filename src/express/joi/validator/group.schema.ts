import * as Joi from 'joi';
import * as JoiObjectId from 'joi-objectid';

const objectIdValidation = JoiObjectId(Joi);

export const getByIdSchema = Joi.object({
    params: {
        id: objectIdValidation().required()
    }
})

export const getByNameSchema = Joi.object({
    params: {
        name: Joi.string().required()
    }
})

export const getByAdminIdSchema = Joi.object({
    params: {
        id: objectIdValidation().required()
    }
})