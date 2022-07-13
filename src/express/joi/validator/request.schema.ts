import { GROUP_TYPE, RESPONSIBILITY_PERM } from './../../../config/enums';
import * as Joi from 'joi';

export type approvalNeed = {
    authorityId: string;
    approvalType: RESPONSIBILITY_PERM;
};

export type createGroupDTO = {
    name: string;
    types: GROUP_TYPE[];
    applicant: string;
    approvalsNeeded?: approvalNeed[]; // TODO: should be required?
};

export const createGroupRequestSchema = Joi.object({
    body: {
        name: Joi.string().required(),
        types: Joi.alternatives()
            .try(Joi.array().items(Joi.string().valid(...Object.values(GROUP_TYPE))), Joi.string())
            .required(),
        applicant: Joi.string().required(), // TODO: consider transform to objectId validation
        approvalsNeeded: Joi.array().items(
            Joi.object({
                authorityId: Joi.string().required(),
                approvalType: Joi.string().valid(...Object.values(RESPONSIBILITY_PERM)).required(),
            }),
        ),
    },
});

export const approveRequestSchema = Joi.object({
    params: {
        requestId: Joi.string().required()
    },
    body: {
        authorityId: Joi.string().required(),
        approved: Joi.boolean().required()
    }
})
