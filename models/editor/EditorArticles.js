const uniqueValidator = require('mongoose-unique-validator')
const mongoose        = require('mongoose')
const User            = mongoose.model('User')
const slug            = require('slug') 

const EditorArticleSchema = new mongoose.Schema({
  slug     : { type: String, lowercase: true, unique: true },
  title    : Object,
  subtitle : Object,
  body     : Object,
  poster   : String,
  liked    : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments : [{ type: mongoose.Schema.Types.ObjectId, ref: "EditorComment"}],
  tags     : [{ type: String }],
  genre    : String,
  author   : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  stage    : { type: String, default: 'draft'}
}, { timestamps: true })


/**
 * Updates number of favorites count on an article.
 * 
 * @return {[type]} [description] // todo dont know yet lol
 */
EditorArticleSchema.methods.updateFavoriteCount = () => {
  let article = this.articles
  return User.count({ favorites: { $in: [article._id] } }).then((count) => {
    article.favoritesCount = count

    return article.save()
  })
}

EditorArticleSchema.methods.toJSONFor = function (user) {
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    subtitle: this.subtitle,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    stage: this.stage,
    tags: this.tags,
    genre: this.genre,
    author: user
  }
}

mongoose.model('EditorArticles', EditorArticleSchema)