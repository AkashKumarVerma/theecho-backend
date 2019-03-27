const mongoose              = require('mongoose')
const router                = require('express').Router()
const passport              = require('passport')
const auth                  = require('./../auth')
const SubmissionsController = require('./../../controllers/admin/SubmissionsController')

router.get('/',
  SubmissionsController.getSubmissions)

router.get('/skeleton/:id',
  SubmissionsController.getSubmissionSkeleton)

router.post('/approve',
  SubmissionsController.approveSubmission)

module.exports = router