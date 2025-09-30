const mongoose = require("mongoose");
const Joi = require("joi");

const countrySchema = new mongoose.Schema({
  name: String,
  capital: String,
  pop: Number,
  img: String,
  date: {
    type: Date, default: Date.now()
  },
  user_id: String
})

exports.CountryModel = mongoose.model("countries", countrySchema);

exports.validateCountry = (_body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required(),
    capital: Joi.string().min(2).max(50).trim().required(),
    pop: Joi.number().integer().min(0).max(2_000_000_000).required(),
    img: Joi.string().min(0).max(500),
  });

  return schema.validate(_body, { abortEarly: false });
};

exports.validateCountryEdit = (_body) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).trim(),
    capital: Joi.string().min(2).max(50).trim(),
    pop: Joi.number().integer().min(0).max(2_000_000_000),
    img: Joi.string().min(0).max(500),
  })
    .min(1);

  return schema.validate(_body, { abortEarly: false });
};