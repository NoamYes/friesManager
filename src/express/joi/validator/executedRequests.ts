import * as Joi from 'joi';

export const executedRequestSchema = Joi.object({
    body: {
        requestNumber: Joi.number().required(),
    }
})