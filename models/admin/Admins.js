const mongoose        = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const crypto          = require('crypto')
const jwt             = require('jsonwebtoken')
const secret          = 'theecho'

const AdminSchema = new mongoose.Schema({
  username : String,
  email    : { type: String, required: true, unique: true, match: [/\S+@theecho.in/, 'Either email is not in valid form or not ending with @theecho.in.'] },
  image    : String,
  hash     : String,
  salt     : String,
  verified : { type: Boolean, default: false },
  level    : { type: String, default: 'admin' },
}, {
  timestamps: true
})

AdminSchema.plugin(uniqueValidator, { message: 'AdminSchema Duplicate Field Error'})

AdminSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}


AdminSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}


AdminSchema.methods.generateJWT = function() {
  const today = new Date()
  const exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign({
    id: this._id,
    email: this.email,
    exp: parseInt(exp.getTime() / 1000)
  }, secret)
}

AdminSchema.methods.toAuthJSON = function() {
  return {
    id: this._id,
    email: this.email,
    token: this.generateJWT(),
    image: this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
    username: this.username,
    verified: this.verified
  }
}

mongoose.model('Admins', AdminSchema)