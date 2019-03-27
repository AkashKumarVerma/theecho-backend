const router                = require('express').Router()
const passport              = require('passport')
const auth                  = require('./../auth')
const ApprovedController = require('./../../controllers/admin/ApprovedController')

router.get('/',
  ApprovedController.getApprovedArticles)

router.get('/skeleton/:id',
  ApprovedController.getApprovedArticlesSkeleton)

router.put('/publish',
  ApprovedController.publishArticle)

module.exports = router