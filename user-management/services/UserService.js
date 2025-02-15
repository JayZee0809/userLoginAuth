/* eslint-disable no-async-promise-executor */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const UUID = require('uuid');
const { Users } = require('../../models/userModel');
const { UserLoginToken } = require('../../models/userLoginToken');

const logger = require('../../loaders/loggerv2');
const customErrorMessages = require('../../loaders/customErrorLogs');

module.exports = class UserService {
    static async getUser(req, param) {
        try {
            logger.serviceStart(req, this.getUser.name);

            const user = await Users.findOne({ $or: [{ username: param }, { email: param }] });
            
            logger.debug(req, this.getUser.name, user);
            
            return user;
        } catch (error) {
            logger.error(
                req,
                `Could not fetch user ${error.message}`,
                this.getUser.name,
                customErrorMessages.statusCode.GET_USER_BY_EMAIL_ERROR
            );
        } finally {
            logger.serviceEnd(req, this.getUser.name);
        }
    }

    static async createUser(req) {
        return new Promise(async (resolve, reject) => {
            try {
                logger.serviceStart(req, this.createUser.name);
                const { name, email, password, username, country, dob, gender } = req.body;

                const foundUser = await Users.findOne({
                    email
                });

                logger.debug(req, this.createUser.name, foundUser);

                if (!foundUser) {
                    const hashedPassword = await bcrypt.hash(password, 12);
                    await Users.create({
                        _id: UUID.v4(),
                        name,
                        email: email.toLowerCase(),
                        password: hashedPassword,
                        username,
                        country,
                        dob,
                        gender
                    });

                    return resolve(`Account has been created succesfully created`);
                }

                return resolve(false);
            } catch (error) {
                logger.error(
                    req,
                    error.message,
                    this.createUser.name,
                    customErrorMessages.statusCode.CREATE_USER_ERROR
                );

                return reject(error);
            } finally {
                logger.serviceEnd(req, this.createUser.name);
            }
        });
    }

    static async updateUser(req, data, id) {
        try {
            logger.serviceStart(req, this.updateUser.name);

            const userDetails = await Users.updateOne({ _id: id }, data, { new: true });

            logger.debug(req, this.updateUser.name, userDetails);

            if(!userDetails) throw new Error(`User not found...`);
            return true;
        } catch (err) {
            logger.error(
                req,
                `Error: ${err.message}`,
                this.updateUser.name,
                customErrorMessages.statusCode.UPDATE_USER_ERROR
            );
            throw err;
        } finally {
            logger.serviceEnd(req, this.updateUser.name);
        }
    }

    static async createUserLoginToken(req, data) {
        try {
            logger.serviceStart(req, this.createUserLoginToken.name);
            const token = await UserLoginToken.create(data);
            
            if (token) return true;

            throw new Error(`couldn't create token...`)
        } catch (err) {
            logger.error(
                req,
                `Error : ${err.message}`,
                this.createUserLoginToken.name,
                customErrorMessages.statusCode.USER_ACCESS_TOKEN_ERROR
            );
            throw err;
        } finally {
            logger.serviceEnd(req, this.createUserLoginToken.name);
        }
    }

    static async updateUserLoginToken(req, data, id) {
        try {
            const tokenDetails = await UserLoginToken.update({ _id: id }, data, { new: true })

            if(!tokenDetails) throw new Error(`User not found...`);
            if(tokenDetails.access_token) throw new Error(`User not found...`);
            return true;
        } catch (error) {
            
        }
    }

};
