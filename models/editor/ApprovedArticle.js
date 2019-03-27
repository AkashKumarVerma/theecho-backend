const mongoose = require('mongoose')

const ApprovedArticlesSchema = new mongoose.Schema({
  slug     : { type: String, lowercase: true, unique: true },
  title    : Object,
  subtitle : Object,
  body     : Object,
  poster   : String,
  likes    : Number,
  comments : [{ type: mongoose.Schema.Types.ObjectId, ref: 'EditorComment' }],
  tags     : [{ type: String }],
  author   : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stage    : { type: String, default: 'draft' }
}, { timestamps: true })


ApprovedArticles.methods.like = () => {
  this.likes = this.likes + 1
}

mongoose.model('ApprovedArticles', ApprovedArticlesSchema)