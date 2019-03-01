const { DB_CONFIG } = require('./../config')
const mongoose = require('mongoose')

mongoose.connect(DB_CONFIG.DB_URI, { useNewUrlParser: true })
let db = mongoose.connection


module.exports = db