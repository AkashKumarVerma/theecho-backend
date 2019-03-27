const router                = require('express').Router()
const passport              = require('passport')
const auth                  = require('./../auth')
const ArticleController     = require('./../../controllers/client/ArticleController')

router.get('/',
  ArticleController.getLanding)

module.exports = router