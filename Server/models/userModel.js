const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { config } = require('../config/secret');

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    date_created: { type: Date, default: Date.now },
    role: {
        type: String, default: "user"
    }

})

exports.UserModel = mongoose.model('users', userSchema);

exports.createToken = (user_id, role) => {
    let token = jwt.sign({ user_id, role }, config.tokenSecret, { expiresIn: '60mins' });
    return token;
}

exports.validateUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(8).max(50).required()
    });
    return joiSchema.validate(_reqBody);
}

exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(5).max(50).required().email(),
        password: Joi.string().min(8).max(50).required()
    });
    return joiSchema.validate(_reqBody);
}