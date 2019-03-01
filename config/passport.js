const mongoose      = require('mongoose')
const passport      = require('passport')
const User          = mongoose.model('User')
const LocalStartegy = require('passport-local').Strategy

passport.use(new LocalStartegy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  console.log('passport')
  User.findOne({ email })
    .then((user) => {
      if(!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { message: 'email or password is invalid'}})
      }

      return done(null, user)
    }).catch(done)
}))