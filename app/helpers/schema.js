const Joi = require('joi');

const userNameRegx = /^[0-9]*\s?[a-zA-Z]+[a-zA-Z0-9\s.]*$/;
const passwordPattern = /^(?=.*[A-Za-z\d])(?=.*\d)[@#$A-Za-z\d]{8,}$/;
// Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length

const schemas = {
    userSchema: Joi.object().keys({
        password: Joi.string().custom((value, helpers) => {
            if (passwordPattern.test(value)) {
                return true;
            }
            return helpers.message(
                'Password must be atleast 8 characters and contain minimum one letter and one number.'
            );
        }),
        email: Joi.string().email({ minDomainSegments: 2 }).min(5).required(),
        name: Joi.string().custom((value, helpers) => {
            if (userNameRegx.test(value)) {
                return true;
            }
            return helpers.message(
                'Name must contain atleast one character and should not contain special characters.'
            );
        })
    }),
    passwordValidation: Joi.string().regex(RegExp(passwordPattern)).required()
};

module.exports = schemas;
