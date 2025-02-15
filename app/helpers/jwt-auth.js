const { unauthorizedResponse } = require('./customMessage');
const { Jwt } = require('../libs/jwt');
const { UserLoginToken } = require('../../models/userLoginToken');

class Token {
    async authenticate(req, res, next) {
        const bearerHearder = req.headers.authorization;

        if (typeof bearerHearder !== 'undefined') {
            try {
                const bearer = bearerHearder.split(' ');
                const bearerToken = bearer[1];
                const token_decoded = await Jwt.verifyToken(bearerToken);

                const userLoginToken = await UserLoginToken.find(
                    {
                        $and: [
                            {user_id : token_decoded.user_id},
                            {access_token : { $regex: bearerToken }} 
                        ]
                    }
                );

                if (!userLoginToken || !userLoginToken.length) {
                    return unauthorizedResponse(req, res, 'User is unauthorized.');
                }

                if (userLoginToken) {
                    req.user = token_decoded;
                    return next();
                }

                return unauthorizedResponse(req, res, 'User is logged out.');
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
