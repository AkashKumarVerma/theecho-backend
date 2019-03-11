const router   = require('express').Router()
const mongoose = require('mongoose')
const auth     = require('./../auth')
const ArticleValidation = require('./../../validations/ArticleValidation')
const DraftsController = require('./../../controllers/DraftsController')

router.post('/',
  ArticleValidation.validateDraft,
  DraftsController.addDraft)

router.post('/draft',
  DraftsController.getDraftById)



module.exports = router