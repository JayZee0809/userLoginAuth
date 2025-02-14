const { unauthorizedResponse } = require('./customMessage');
const { Jwt } = require('../libs/jwt');
const { UserLoginToken } = require('../../models/userLoginToken');

class Token {
    async authenticate(req, res, next) {
        const bearerHearder = req.headers.authorization;

        if (typeof bearerHearder !== 'undefined') {
            try {
                // logger.info(`bearerHearder... ${bearerHearder}`);
                const bearer = bearerHearder.split(' ');
                const bearerToken = bearer[1];
                const token_decoded = await Jwt.verifyToken(bearerToken);

                const userLoginToken = await UserLoginToken.find(
                    {
                        user_id : token_decoded.id,
                        login_token : { $regex: bearerToken } 
                    }
                );

                if (!userLoginToken) {
                    return unauthorizedResponse(req, res, 'User is unauthorized.');
                }

                console.log('authenticate', userLoginToken);

                if (userLoginToken) {
                    req.user = token_decoded;
                    return next();
                }

                return unauthorizedResponse(req, res, 'User is logout.');
            } catch (err) {
                console.log(err);
                return unauthorizedResponse(req, res, 'Token has expired.');
            }
        } else {
            return unauthorizedResponse(req, res, 'A token is required for authentication.');
        }
    }
}

module.exports = new Token().authenticate;
