const mongoose      = require('mongoose')
const passport      = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT   = require('passport-jwt')
const JWTStrategy   = passportJWT.Strategy
const bcrypt        = require('bcrypt')

const { secret }    = require('./keys') 

const Editors = mongoose.model('User')
const Admins  = mongoose.model('Admins')
const Clients = mongoose.model('ClientUsers')


passport.use(new LocalStrategy({
  usernameField : email,
  passwordField : password
}, async (email, password, done) => {
  try {
    const clientDocument = await Clients.findOne({ email: email }).exec()
    const passwordMatch  = await clientDocument.validatePassword(password)

    if(clientDocument && passwordMatch) {
      return done(null, clientDocument)
    } else {
      return done('Incorrect Email / Password')
    }
  } catch (error) {
    done(err)
  }
}))


passport.use(new JWTStrategy({
  jwtFromRequest: req => req.cookies.jwt,
  secretOrKey: secret,
}, (jwtPayload, done) => {
  if(Date.now() > jwtPayload.expires) {
    return done('jwt expired')
  }

  return done(null, jwtPayload)
}))