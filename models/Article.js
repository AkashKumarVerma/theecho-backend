const uniqueValidator = require('mongoose-unique-validator')
const mongoose        = require('mongoose')
const User            = mongoose.model('User')
const slug            = require('slug') 

const ArticleSchema = new mongoose.Schema({
  slug     : { type: String, lowercase: true, unique: true },
  title    : Object,
  subtitle : Object,
  body     : Object,
  poster   : String,
  liked    : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments : [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
  tagList  : [{ type: String }],
  author   : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status   : { type: String, default: 'draft'}
}, { timestamps: true })


/**
 * Updates number of favorites count on an article.
 * 
 * @return {[type]} [description] // todo dont know yet lol
 */
ArticleSchema.methods.updateFavoriteCount = () => {
  let article = this.articles
  return User.count({ favorites: { $in: [article._id] } }).then((count) => {
    article.favoritesCount = count

    return article.save()
  })
}

ArticleSchema.methods.toJSONFor = function (user) {
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    subtitle: this.subtitle,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    author: this.author.toProfileJSONFor(user)
  }
}

mongoose.model('Article', ArticleSchema)