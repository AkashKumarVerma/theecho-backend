const express       = require('express')
const cors          = require('cors')
const morgan        = require('morgan')
const session       = require('express-session')
const mongoose      = require('mongoose')
const bodyParser    = require('body-parser')
const errorhandler  = require('errorhandler')
const DB_CONFIG     = require('./config/db')

const app           = express()
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

global.__basedir = __dirname

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(express.static(__dirname + '/public'))

app.use(session({
  secret: 'theecho',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false
}))

if(IS_PRODUCTION) { 
  app.use(errorhandler()) 
  mongoose.connect(DB_CONFIG.DB_URI, { useNewUrlParser: true })
} else {
  console.log('Connecting To local database')
  // mongoose.connect(DB_CONFIG.DB_URI, { useNewUrlParser: true })
  mongoose.connect('mongodb://localhost/theecho', { useNewUrlParser: true })
  mongoose.set('debug', true)
}

const db = mongoose.connection
db.once('open', () => { 
  console.log('Databse Connection Successful')
})

// Editor Modles
require('./models/editor/Users')
require('./models/editor/Article')
require('./models/editor/EditorArticles')
require('./models/editor/EditorComments')
require('./models/editor/EditorDrafts')
// Admin Models
require('./models/admin/Admins')
require('./models/admin/ReviewSlips')
// Client Models
require('./models/client/ClientArticle.js')
require('./models/client/ClientUsers.js')
// General Modals
require('./models/general/Genre')
require('./models/general/Tags')
// require('./config/passport')



app.use('/', require('./routes'))

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


let server = app.listen( process.env.PORT || 3001, () => {
  console.log(`Server listning on port ${server.address().port}`)
})