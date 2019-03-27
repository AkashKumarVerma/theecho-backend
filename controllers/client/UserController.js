const mongoose = require('mongoose')
const passport = require('passport')
const User = mongoose.model('User')

const register = (req, res, next) => {

  let user = new User()
  let { username, email, password } = req.body
  
  user.username = username
  user.email    = email
  user.setPassword(password) 

  user.save()
    .then((user) => {
      console.log(user)
      return res.json({
        status: 'OK',
        value: {
          user: user.toAuthJSON()        
        }
      })
    }).catch((err) => {
      return res.json({
        status: 'FAILED',
        error: {
          code: 'internalError',
          message: 'Failed to create account. Please try again.'
        }
      })
    })
}

module.exports = {
  register
}