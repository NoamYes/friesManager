import * as Joi from 'joi';

//TODO: check objectId
export const getByIdSchema = Joi.object({
    params: {
        id: Joi.string().required()
    }
})

export const getByNameSchema = Joi.object({
    params: {
        name: Joi.string().required()
    }
})

export const getByAdminIdSchema = Joi.object({
    params: {
        id: Joi.string().required()
    }
})