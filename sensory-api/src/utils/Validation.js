const Joi = require('joi');

const userValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        name: Joi.string().min(3).required(),
    });
    return schema.validate(data);
};

const trackerValidation = (data) => {
    const schema = Joi.object({
        httpMethod: Joi.string().min(3).required(),
        statusCode: Joi.number().required(),
        path: Joi.string().min(3).required(),
        trackedFrom: Joi.string().min(3).required(),
    });
    return schema.validate(data);
}

module.exports = { userValidation, trackerValidation };
