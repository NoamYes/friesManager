import { GROUP_TYPE } from './../../../config/enums';
import * as Joi from 'joi';

export type createGroupDTO = {
    name: string;
    types: GROUP_TYPE[];
    applicant: string;
};

export const createGroupRequestSchema = Joi.object({
    body: {
        name: Joi.string().required(),
        types: Joi.alternatives()
            .try(Joi.array().items(Joi.string().valid(Object.values(GROUP_TYPE))), Joi.string())
            .required(),
        applicant: Joi.string().required(), // TODO: consider transform to objectId validation
    },
});
