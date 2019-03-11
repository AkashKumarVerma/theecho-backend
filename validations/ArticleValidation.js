const Joi = require('joi')

const SCHEMA_DRAFT_ARTICLE = Joi.object().keys({
  poster: Joi.string().empty(),
  title: Joi.object().required(),
  subtitle: Joi.object(),
  body: Joi.object(),
  stage: Joi.string()
})


const SCHEMA_DRAFT = Joi.object().keys({
  id: Joi.string().required(),
  draft: SCHEMA_DRAFT_ARTICLE
})


const validateDraft = (req, res, next) => {
  console.log(req.body)
  const { error, value } = Joi.validate(req.body, SCHEMA_DRAFT)

  if(error) {
    res.json({
      status: 'FAILED',
      error: {
        code: error.name,
        message: error.details[0].message
      }
    })
  } else {
    next()
  }
}

module.exports = {
  validateDraft
}