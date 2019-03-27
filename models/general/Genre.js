const mongoose = require('mongoose')

const GenreSchema = new mongoose.Schema({
  name: String,
  active: { type: Boolean, default: false }
})

mongoose.model('Genre', GenreSchema)