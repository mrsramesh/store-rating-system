// middleware/validationMiddleware.js
const Joi = require('joi');

const validationMiddleware = {
  // User validation
  validateUser: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(10).max(60).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(8)
        //.max(16)
        .pattern(new RegExp('^(?=.*[A-Z])(?=.*[!@#$%^&*])'))
        .required()
        .messages({
          'string.pattern.base': 'Password must contain at least one uppercase letter and one special character'
        }),
      address: Joi.string().max(400).allow(''),
      role: Joi.string().valid('admin', 'user', 'store_owner')
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }
    next();
  },

  // Rating validation
  validateRating: (req, res, next) => {
    const schema = Joi.object({
      rating_value: Joi.number().integer().min(1).max(5).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }
    next();
  },

  // Store validation
  validateStore: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().max(100).required(),
      address: Joi.string().max(400).allow(''),
      ownerId: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message
      });
    }
    next();
  }
};

module.exports = validationMiddleware;