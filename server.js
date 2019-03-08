const express      = require('express')
const path         = require('path')
const bodyParser   = require('body-parser')
const cors         = require('cors')
const mongoose     = require('mongoose')
const morgan       = require('morgan')
const passport     = require('passport')
const session      = require('express-session')
const errorhandler = require('errorhandler')
const DB_CONFIG    = require('./config/db')

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

// Create global app object
const app = express()


// Normal Express config defaults
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))

app.use(session({ secret: 'theecho', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }))

if(!IS_PRODUCTION) {
  app.use(errorhandler())
}


if (IS_PRODUCTION) {
  mongoose.connect(DB_CONFIG.DB_URI, { useNewUrlParser: true })
} else {
  console.log('Connecting To local database')
  mongoose.connect('mongodb://localhost/theecho', { useNewUrlParser: true })
  mongoose.set('debug', true)
}

const db = mongoose.connection
db.once('open', () => { console.log('Databse Connection Successful')})

require('./models/User')
require('./models/Article')
require('./models/Comment')
require('./config/passport')

app.use('/api', require('./routes'))
app.use('/', (req, res) => {
  res.send('The Echo Media Pvt. Ltd.')
})

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// errro handlers

// development error handler will print stacktrace
if(!IS_PRODUCTION) {
  app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(err.status || 500)
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    })
  })
}


// Production error handler no stacktrace leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  })
})


let server = app.listen( process.env.PORT || 3000, () => {
  console.log(`Server listning on port ${server.address().port}`)
})