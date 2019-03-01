const mongoose = require('mongoose')
const passport = require('passport')
const User = mongoose.model('User')

const getUser = (req, res, next) => {
  // User.findById
  console.log(req)
}

const register = (req, res, next) => {
  let user = new User()
  let { username, email, password } = req.body

  // res.send({username, email, password})

  user.username = username
  user.email    = email
  user.setPassword(password) 

  user.save()
    .then(() => {
      return res.json({ user: user.toAuthJSON() })
    }).catch(next)
}

const login = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        res.send({ errors: { message: 'email or password is invalid'}})
      }
      user.token = user.generateJWT()
      return res.json({
        user: user.toAuthJSON()
      })
    }).catch((err) => {
      res.send(err)
    })
}


module.exports = {
  getUser,
  register,
  login
}