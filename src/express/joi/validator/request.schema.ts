import { GROUP_TYPE } from './../../../config/enums';
import * as Joi from 'joi';

type approvalNeed = {
    id: string;
    approvalType: string;
};

export type createGroupDTO = {
    name: string;
    types: GROUP_TYPE[];
    applicant: string;
    approvalsNeeded?: approvalNeed[];
};

export const createGroupRequestSchema = Joi.object({
    body: {
        name: Joi.string().required(),
        types: Joi.alternatives()
            .try(Joi.array().items(Joi.string().valid(Object.values(GROUP_TYPE))), Joi.string())
            .required(),
        applicant: Joi.string().required(), // TODO: consider transform to objectId validation
        approvalsNeeded: Joi.array().items(
            Joi.object({
                id: Joi.string().required(),
                approvalType: Joi.string().required(),
            }),
        ),
    },
});
