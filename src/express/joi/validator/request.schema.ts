import { GROUP_TYPE, RESPONSIBILITY_PERM } from './../../../config/enums';
import * as Joi from 'joi';

export type basicRequestDTO = {
    applicant: string;
    approvalsNeeded?: approvalNeed[]; // TODO: should be required?
}

export type approvalNeed = {
    authorityId: string;
    approvalType: RESPONSIBILITY_PERM;
};

export type createGroupDTO = basicRequestDTO & {
    name: string;
    types: GROUP_TYPE[];
    clearance?: string;
};

export type disToGroupDTO = basicRequestDTO & {
    groupId: string;
    disUniqueId: string[];
}

export const createGroupRequestSchema = Joi.object({
    body: {
        name: Joi.string().required(),
        types: Joi.alternatives()
            .try(Joi.array().items(Joi.string().valid(...Object.values(GROUP_TYPE))), Joi.string())
            .required(),
        clearance: Joi.string(),
        applicant: Joi.string().required(), // TODO: consider transform to objectId validation
        approvalsNeeded: Joi.array().items(
            Joi.object({
                authorityId: Joi.string().required(),
                approvalType: Joi.string().valid(...Object.values(RESPONSIBILITY_PERM)).required(),
            }),
        ),
    },
});

export const AddDisToGroupSchema = Joi.object({
    body: {
        groupId: Joi.string().required(),
        disUniqueId: Joi.array().items(Joi.string()).required(),
        applicant: Joi.string().required(),
        approvalsNeeded: Joi.array().items(
            Joi.object({
                authorityId: Joi.string().required(),
                approvalType: Joi.string().valid(...Object.values(RESPONSIBILITY_PERM)).required(),
            }),
        ),
    },
});

export const removeDisFromGroupSchema = AddDisToGroupSchema;

export const approveRequestSchema = Joi.object({
    params: {
        requestId: Joi.string().required()
    },
    body: {
        authorityId: Joi.string().required(),
        approved: Joi.boolean().required()
    }
})

// export const schemasMap = {
//     [REQUEST_TYPE.CREATE_GROUP]: createGroupRequestSchema,
//     [REQUEST_TYPE.ADD_DIS_GROUP]: AddDisToGroupSchema,
//     [REQUEST_TYPE.REMOVE_DIS_GROUP]: removeDisFromGroupSchema,
// }
