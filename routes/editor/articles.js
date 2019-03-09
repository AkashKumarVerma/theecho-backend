const router   = require('express').Router()
const mongoose = require('mongoose')
const auth     = require('./../auth')
const ArticleController = require('./../../controllers/ArticleController')

router.get('/', ArticleController.getArticle)
router.post('/', ArticleController.addArticle)

module.exports = router