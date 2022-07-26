import { GROUP_TYPE, RESPONSIBILITY_PERM } from './../../../config/enums';
import * as Joi from 'joi';
import * as JoiObjectId from 'joi-objectid';

const objectIdValidation = JoiObjectId(Joi);

export type basicRequestDTO = {
    applicant: string;
    approvalsNeeded?: approvalNeed[]; // TODO: should be required?
};

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
};

export type entitiesDTO = basicRequestDTO & {
    groupId: string;
    entitiesId: string[];
};

export type approveRoundDTO = {
    requestNumber: number;
    authorityId: string;
    approved: boolean;
};

export const createGroupRequestSchema = Joi.object({
    body: {
        name: Joi.string().required(),
        types: Joi.alternatives()
            .try(Joi.array().items(Joi.string().valid(...Object.values(GROUP_TYPE))), Joi.string())
            .required(),
        clearance: Joi.string(),
        applicant: objectIdValidation().required(), // TODO: consider transform to objectId validation
        approvalsNeeded: Joi.array().items(
            Joi.object({
                authorityId: Joi.string().required(),
                approvalType: Joi.string()
                    .valid(...Object.values(RESPONSIBILITY_PERM))
                    .required(),
            }),
        ),
    },
});

export const DisToGroupSchema = Joi.object({
    body: {
        groupId: objectIdValidation().required(),
        disUniqueId: Joi.array().items(Joi.string()).required(),
        applicant: objectIdValidation().required(),
        approvalsNeeded: Joi.array().items(
            Joi.object({
                authorityId: Joi.string().required(),
                approvalType: Joi.string()
                    .valid(...Object.values(RESPONSIBILITY_PERM))
                    .required(),
            }),
        ),
    },
});

export const entitiesToGroupSchema = Joi.object({
    body: {
        groupId: objectIdValidation().required(),
        entitiesId: Joi.array().items(Joi.string()).required(), // TODO: validate objectId ?
        applicant: objectIdValidation().required(),
        approvalsNeeded: Joi.array().items(
            Joi.object({
                authorityId: Joi.string().required(),
                approvalType: Joi.string()
                    .valid(...Object.values(RESPONSIBILITY_PERM))
                    .required(),
            }),
        ),
    },
})

export const approveRequestSchema = Joi.object({
    params: {
        requestNumber: Joi.number().required(),
    },
    body: {
        authorityId: Joi.string().required(),
        approved: Joi.boolean().required(),
    },
});

// export const schemasMap = {
//     [REQUEST_TYPE.CREATE_GROUP]: createGroupRequestSchema,
//     [REQUEST_TYPE.ADD_DIS_GROUP]: AddDisToGroupSchema,
//     [REQUEST_TYPE.REMOVE_DIS_GROUP]: removeDisFromGroupSchema,
// }
