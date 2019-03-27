const mongoose = require('mongoose')
const passport = require('passport')

const Admins   = mongoose.model('Admins')



const getUser = async (req, res, next) => {

}


const register = async (req, res, next) => {

  let admin = new Admins()
  let { username, email, password } = req.body

  admin.username = username
  admin.email    = email
  admin.level    = 'admin'
  admin.setPassword(password)


  admin.save()
    .then((res) => {
      console.log(res)
      return res.json({
        status: 'OK',
        value: {
          user: admin.toAuthJSON()
        }
      })
    }).catch((err) => {
      return res.json({
        status: 'FAILED',
        error: {
          code: 'internalError',
          messgae: 'Failed to create acoount. Please try again.'
        }
      })
    })
}


const login = async (req, res, next) => {

  const { email, password } = req.body

  Admins.findOne({ email })
    .then((admin) => {
      if(!admin || !admin.validatePassword(password)) {
        res.send({
          status: 'FAILED',
          error: {
            code: 'AuthenticationError',
            message: 'Email or Password not found.'
          }
        })
      } else {
        return res.json({
          status: 'OK',
          value: {
            admin: admin.toAuthJSON()
          }
        })
      }
    }).catch((err) => {
      console.log(err)
      res.send({
        status: 'FAILED',
        error: {
          code: 'InternalError',
          message: 'Something went wront up here.'
        }
      })
    })
}

module.exports = {
  login,
  register,
  getUser
}