const mongoose = require('mongoose')
const passport = require('passport')
const User = mongoose.model('User')

const getUser = (req, res, next) => {
  User.findOne({ _id: req.body.id })
    .then((user) => {
      res.json(user)
    })
}


/**
 * [description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
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
        status: 'ok',
        user: user.toAuthJSON()
      })
    }).catch((err) => {
      console.log(err)
    })
}



/**
 * [description]
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
const login = (req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        res.send({ error: { message: 'email or password is invalid'}})
      }
      user.token = user.generateJWT()
      return res.json({
        status: 'success',
        value: user.toAuthJSON()
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