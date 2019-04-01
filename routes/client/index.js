const router = require('express').Router()
const AuthController = require('./../../controllers/client/AuthController')
const ArticleController = require('./../../controllers/client/ArticleController')

router.post('/login', 
  AuthController.login)

router.post('/register',
  AuthController.register)

router.get('/landing',
  ArticleController.getLandingPage)

router.get('/article/:slug',
  ArticleController.getArticleBySlug)

router.get('/image',
  ArticleController.image)

module.exports = router