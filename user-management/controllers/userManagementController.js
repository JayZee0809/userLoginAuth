/* eslint-disable no-restricted-globals */
const UserService = require('../services/UserService');
const { badRequestResponse, okResponse } = require('../../app/helpers/customMessage');
const joiSchema = require('../../app/helpers/schema');
const logger = require('../../loaders/loggerv2');
const customErrorMessages = require('../../loaders/customErrorLogs');

const joiOptions = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true // remove unknown props
};

// exports.getUsers = async (req, res) => {
//     try {
//         const result = await UserService.getUsers(req);

//         switch (result) {
//             case null:
//                 logger.error(req, result, 'getUsers', customErrorMessages.statusCode.GET_USERS_ERROR);
//                 return badRequestResponse(req, res, `No user data found`);

//             default:
//                 return okResponse(req, res, result);
//         }
//     } catch (error) {
//         logger.error(req, error.message, 'getUsers', customErrorMessages.statusCode.GET_USERS_ERROR);

//         return badRequestResponse(req, res, error);
//     }
// };

exports.createUser = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) return badRequestResponse(req, res, `Body is empty`);
        const { name, password, email } = req.body;

        if (name.length < 4 || name.length > 50) {
            return badRequestResponse(req, res, 'Please insert minimum 4 character and maximum 50 characters only');
        }

        if (password.length < 8) {
            return badRequestResponse(req, res, 'Password must be atleast 8 characters long.');
        }

        const { error } = joiSchema.userSchema.validate(req.body, joiOptions);

        if (error) {
            return badRequestResponse(req, res, error.details[0].message);
        }

        const result = await UserService.createUser(req);
        switch (result) {
            case false:
                return badRequestResponse(req, res, `user already exists`);

            default:
                const authBody = Buffer.from(`${email}:${password}`, "utf-8").toString(
                    "base64"
                );

                console.log(authBody);
                
                return okResponse(req, res, result);
        }
    } catch (error) {
        logger.error(
            req,
            error.message,
            'createUser',
            customErrorMessages.statusCode.CREATE_USER
        );

        return badRequestResponse(req, res, error);
    }
};

exports.getUserByEmailOrUsername = async (req, res) => {
    try {
        const { param } = req.body;
        if (!param) throw new Error('empty search params...')
        const { 
            name,
            email,
            password,
            username,
            country,
            dob,
            gender
        } = await UserService.getUser(req, param);
        const response = { name, email, password, username, country, dob, gender }

        switch (response) {
            case null:
                logger.error(
                    req,
                    result,
                    'getUserById',
                    customErrorMessages.statusCode.GET_USER_ERROR
                );
                return badRequestResponse(req, res, `No user data found`);

            default:
                return okResponse(req, res, response);
        }
    } catch (error) {
        logger.error(
            req,
            error.message,
            'getUserById',
            customErrorMessages.statusCode.GET_USER_ERROR
        );

        return badRequestResponse(req, res, error);
    }
};
