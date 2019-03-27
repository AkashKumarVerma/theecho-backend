const mongoose = require('mongoose')

const SlipSchema = new mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'EditorArticles' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admins' },
  verdict: String,
}, { timestamps: true })

mongoose.model('ReviewSlips', SlipSchema)
