const Joi = require('joi')

/**
 * Joi Schema for Registration Object.
 * @type {[type]}
 */
const SCHEMA_REGISTRATION = Joi.object().keys({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

/**
 * Joi schema for login object.
 */
const SCHEMA_LOGIN = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})


/**
 * Validates Registration Object passed by client on registration.
 *
 */
const validateRegistration = (req, res, next) => {
  const {error, value} = Joi.validate(req.body, SCHEMA_REGISTRATION)
  if(error) {
    res.json({
      error: {
        type: error.name,
        message: error.details[0].message
      }
    })
  } else {
    next()
  }
}


/**
 * Validates user object passed by client for login.
 */
const validateLogin = (req, res, next) => {
  const {error, value} = Joi.validate(req.body, SCHEMA_LOGIN)

  if(error) {
    res.json({
      error: {
        type: error.name,
        message: error.details[0].message
      }
    })
  } else {
    next()
  }
}

module.exports = {
  validateRegistration,
  validateLogin
}