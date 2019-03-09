const DB_CONFIG = require('./db')
const passport = require('./passport')

module.exports = {
  DB_CONFIG,
  passport,
  secret: process.env.NODE_ENV === 'production' ? 'theecho' : 'secret'
}