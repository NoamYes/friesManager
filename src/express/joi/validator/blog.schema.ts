import * as Joi from 'joi';

export const createSchema = Joi.object({
    body: {
        title: Joi.string().required(),
        description: Joi.string().required(),
        author: Joi.string().required(),
    },
});

export const updateSchema = Joi.object({
    body: {
        description: Joi.string().required(),
    },
});
