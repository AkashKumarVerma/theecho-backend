const mongoose = require('mongoose')

const TagsSchema = new mongoose.Schema({
  name: String,
  active: { type: Boolean, default: false }
})

mongoose.model('Tags', TagsSchema)