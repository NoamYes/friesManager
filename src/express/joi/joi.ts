import { Request } from 'express';
import * as Joi from 'joi';
import { wrapValidator } from '../utils/wraps';

const defaultValidationOptions: Joi.ValidationOptions = {
    abortEarly: false,
    allowUnknown: false,
    convert: true,
};

const normalizeRequest = (req: any, value: any) => {
    req.originalBody = req.body;
    req.body = value.body;

    req.originalQuery = req.query;
    req.query = value.query;

    req.originalParams = req.params;
    req.params = value.params;
};

/**
 * Validate the request by the given valid schema
 * @param { Joi.ObjectSchema<any> } schema - The valid schema
 * @param { Joi.ValidationOptions } options - Options
 * @returns - if not valid throws error.
 */
const validateRequest = (schema: Joi.ObjectSchema<any>, options: Joi.ValidationOptions = defaultValidationOptions) => {
    const validator = async (req: Request) => {
        const { error, value } = schema.unknown().validate(req, options);
        if (error) {
            throw error;
        }

        if (options.convert) {
            normalizeRequest(req, value);
        }
    };

    return wrapValidator(validator);
};

export default validateRequest;
