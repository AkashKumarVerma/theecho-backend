const router   = require('express').Router()
const mongoose = require('mongoose')
const auth     = require('./../auth')
const ArticleController = require('./../../controllers/ArticleController')
const ArticleValidation = require('./../../validations/ArticleValidation')

router.get('/', ArticleController.getArticleById)

router.post('/',
  ArticleValidation.validateDraft,
  ArticleController.addDraft)


module.exports = router