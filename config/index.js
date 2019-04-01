const DB_CONFIG = require('./db')

module.exports = {
  DB_CONFIG,
  secret: process.env.NODE_ENV === 'production' ? 'theecho' : 'secret'
}