const uniqueValidator = require('mongoose-unique-validator')
const mongoose        = require('mongoose')
const User            = mongoose.model('User')
const slug            = require('slug') 

const DraftSchema = new mongoose.Schema({
  slug     : { type: String, lowercase: true, unique: true },
  title    : Object,
  subtitle : Object,
  body     : Object,
  poster   : String,
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
DraftSchema.methods.updateFavoriteCount = () => {
  let article = this.articles
  return User.count({ favorites: { $in: [article._id] } }).then((count) => {
    article.favoritesCount = count

    return article.save()
  })
}

DraftSchema.methods.toJSONFor = function (user) {
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
    author: this.author.toProfileJSONFor(user)
  }
}

mongoose.model('EditorDrafts', DraftSchema)