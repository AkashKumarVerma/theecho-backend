const router   = require('express').Router()
const mongoose = require('mongoose')
const auth     = require('./../auth')
const ArticleValidation = require('./../../validations/ArticleValidation')
const DraftsController = require('./../../controllers/DraftsController')

router.post('/draft',
  DraftsController.getDraftById)

router.post('/',
  ArticleValidation.validateDraft,
  DraftsController.addDraft)


module.exports = router