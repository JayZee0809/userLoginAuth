const bcrypt = require('bcrypt');
const Joi = require('joi');
const { unauthorizedResponse, badRequestResponse, okResponse } = require('../../app/helpers/customMessage');
const UserService = require('../services/UserService');
const { Jwt } = require('../../app/libs/jwt');
const logger = require('../../loaders/loggerv2');
const customErrorMessages = require('../../loaders/customErrorLogs');

const validateLoginParams = (reqBody) => {
    const schema = Joi.object({
        email: Joi.string().min(10).max(255).required().email(),
        password: Joi.string().min(8).max(255).required()
    });
    return schema.validate(reqBody);
};

exports.postLogin = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const err = new Error('You are not authorized.');
        return unauthorizedResponse(req, res, err.message);
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    
    const email = auth[0];
    const password = auth[1];

    logger.info(req, `authHeader... ${authHeader}`, 'postLogin');
    logger.info(req, `email... ${email}`, 'postLogin');

    const { error } = validateLoginParams({
        email,
        password
    });

    if (error) {
        return badRequestResponse(req, res, error.details[0].message);
    }

    const user = await UserService.getUser(req, email.toLowerCase());

    if (!user) {
        const err = new Error('No user with that email found.');
        return unauthorizedResponse(req, res, err.message);
    }
    logger.info(req, 'user found...', 'postLogin');

    bcrypt.compare(password, user.password, async (error, isMatch) => {

        if (error) {
            console.log('error', error);
            const err = new Error('passwords do not match.');
            logger.error(req, err.message, 'postLogin', customErrorMessages.statusCode.PASSWORD_DOES_NOT_MATCH);
            return unauthorizedResponse(req, res, err.message);
        }
        if (isMatch) {
            console.log('isMatch', isMatch);
            logger.info(req, 'passwords match...', 'postLogin');

            const loginToken = Jwt.createToken(
                { email: user.email, user_id: user._id },
                { expiresIn: '24h' }
            );

            const loginAt = new Date();

            // update login date
            await UserService.updateUser(req, { login_token: null, loginAt }, user._id);

            // create user login token
            await UserService.createUserLoginToken(req, {
                user_id: user._id,
                login_token: loginToken,
                loginAt
            });

            const message = {
                email: user.email,
                access_token: loginToken,
                user_id: user._id,
                name: user.name,
                username: user.username,
            };

            return okResponse(req, res, message);
        }

        const err = new Error('passwords do not match.');
        logger.error(req, err.message, 'postLogin', customErrorMessages.statusCode.PASSWORD_DOES_NOT_MATCH);

        return unauthorizedResponse(req, res, err.message);
    });

    return null;
};

exports.postLogout = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await UserService.getUser(req, email);

        switch (user) {
            case null:
                return badRequestResponse(req, res, `No user exists with this email ${email}`);
            default:
                await UserService.updateUserLoginToken(req, { login_token: null }, user._id);
                return okResponse(req, res, `User with ${email} has been logged out successfully.`);
        }
    } catch (err) {
        next(err);
    }
    return null;
};
