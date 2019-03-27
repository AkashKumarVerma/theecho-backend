const router   = require('express').Router()
const mongoose = require('mongoose')
const auth     = require('./../auth')
const ArticleController = require('./../../controllers/editor/ArticleController')
const ArticleValidation = require('./../../validations/ArticleValidation')

router.get('/', ArticleController.getArticleById)

router.post('/',
  ArticleController.addArticle)


module.exports = router