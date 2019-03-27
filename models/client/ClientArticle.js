const mongoose = require('mongoose')

const ClientArticleSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  body: String,
  slug: String,
  comments: { type: mongoose.Schema.Types.ObjectId, ref: 'ClientUsers' },
  likes: Number,
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admins'},
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'EditorArticles' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
}, { timestams: true })

mongoose.model('ClientArticles', ClientArticleSchema)