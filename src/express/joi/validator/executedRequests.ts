import * as Joi from 'joi';

export const executedRequestSchema = Joi.object({
    params: {
        requestNumber: Joi.number().required(),
    },
});
