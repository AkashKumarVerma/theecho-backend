const mongoose        = require('mongoose')
const crypto          = require('crypto')
const jwt             = require('jsonwebtoken')
const secret          = 'theecho'
const uniqueValidator = require('mongoose-unique-validator')


const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, required: true, unique: true, match: [/\S+@theecho.in/, 'Either email is not in valid form or not ending with @theecho.in.'] },
  image: String,
  hash: String,
  salt: String,
  verified: { type: Boolean, default: false },
  articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],
  drafts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article'}],
  liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article'}]
}, {
  timestamps: true
})

UserSchema.plugin(uniqueValidator, { message: 'UserSchema Duplicate Field Error'})

UserSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}


UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}


UserSchema.methods.generateJWT = function() {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000)
  }, secret)
}


UserSchema.methods.toAuthJSON = function() {
  return {
    id: this._id,
    email: this.email,
    token: this.generateJWT(),
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    username: this.username,
    verified: this.verified,
    articles: this.articles,
    drafts: this.drafts,
    liked: this.liked
  }
}


UserSchema.methods.toProfileJSONFor = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    verified: this.verified,
    articles: this.articles
  }
}

mongoose.model('User', UserSchema)
