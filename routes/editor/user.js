const mongoose       = require('mongoose')
const router         = require('express').Router()
const passport       = require('passport')
const auth           = require('./../auth')
const UserValidation = require('./../../validations/UserValidation')
const UserController = require('./../../controllers/editor/UserController')

router.get('/',
  UserController.getUser)

router.post('/',
  UserValidation.validateRegistration,
  UserController.register)

router.post('/login',
  UserValidation.validateLogin,
  UserController.login)

module.exports = router