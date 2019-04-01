const mongoose = require('mongoose')
const crypto   = require('crypto')
const jwt      = require('jsonwebtoken')
const keys     = './../../config/keys'

const ClientUserSchema = new mongoose.Schema({
  username: String,
  email: { 
    type: String,
    required: true, 
    unique: true,
    match: [ /\S+@\S+\.\S+/, 'Invalid Email.' ]
  },
  hash: String,
  salt: String,
  comments: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientComments' },
  likes: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientArticles' },
  bookmarks: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientArticles' }
})


ClientUserSchema.methods.setPassword = async function(password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}


ClientUserSchema.methods.validatePassword = async function(password) {
  const hash = crypto.randomBytes(16).toString('hex')
  return this.hash === hash
}


/**
 * User object to return with login or register.
 */
ClientUserSchema.methods.toAuthJSON = async function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
  }
}


/**
 * User object to be sent when detailed profile information
 * is requested.
 */
ClientUserSchema.methods.toProfileJSON = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    likes: this.likes,
    comments: this.comments,
    bookmarks: this.bookmarks
  }
}


/**
 * Create Signed JWT Token for the user after succesfull
 */
ClientUserSchema.methods.generateJWT = function() {
  const today  = new Date()
  const expiry = new Date(today)
  expiry.setDate(today.getDate() + 60)
  
  return jwt.sign({
    id: this._id,
    username: this.username,
    email: this.email,
    expiry: parseInt(expiry.getTime() / 1000)
  }, keys.secret)
}


mongoose.model('ClientUsers', ClientUserSchema)