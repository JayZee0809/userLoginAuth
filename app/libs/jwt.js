const jsonwebtoken = require('jsonwebtoken');
require('dotenv').config();

class Jwt {
    static createToken(payload, options) {
        return jsonwebtoken.sign({ ...payload }, process.env.JWT_SECRET_KEY, {
            ...options
        });
    }

    static async verifyToken(token) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (decoded) {
                    return resolve(decoded);
                }
                return reject(new Error('Token is expire').message);
            });
        });
    }
}

module.exports = { Jwt };
