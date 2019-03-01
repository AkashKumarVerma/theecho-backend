const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
// const secret = require('./../config')
const secret = 'theecho'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  username: String,
  image: String,
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  hash: String,
  salt: String,
  verified: { type: String, default: false},
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })


// For validating thta each user is unique
UserSchema.plugin(uniqueValidator, { message: 'is already taken.'})


/**
 * Validates user password agains the saved hash.
 * @param  {String}   password User password for verification.
 * @return {Boolean}           True or False returned upon verification.
 */
UserSchema.methods.validatePassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}


/**
 * Sets user salt and hashed password.
 * @param  {String} password User password for hashing.
 */
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  console.log('Salt', this.salt)
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  console.log('Hash', this.hash)
}


/**
 * Genetrates JWT Authentication Token.
 * @param  {String}  password User password for creating auth object.
 * @return {Object}           JWT signed auth object.
 */
UserSchema.methods.generateJWT = () => {

  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000)
  }, secret)
}


/**
 * Create AuthJson object of an user.
 * @return {Object} User JSON Auth Object.
 */
UserSchema.methods.toAuthJSON = function () {
  return {
    email: this.email,
    token: this.generateJWT(),
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    username: this.username,
    verified: this.verified
  }
}


/**
 * Returns user object
 * @param  {User}   user User Object
 * @return {Object}      User Object
 */
UserSchema.methods.toProfileJSONFor = (user) => {
  return {
    username: this.username,
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    email: this.email,
    verified: this.verified
  }
}



/**
 *
 * Checks if an articles is favorited by the user.
 * 
 * @param  {mongoose.Schema.Types.ObjectId} id ObjectId of the article.
 * @return {Boolean}                        A boolean value resulting to true if user has
 *                                          favorites the article else false.
 */
UserSchema.methods.isFavorite = (id) => {
  return this.favorites.some((favoriteId) => {
    return favoriteId.toString() === id.toString()
  })
}


mongoose.model('User', UserSchema)
