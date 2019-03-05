const mongoose        = require('mongoose')
const slug            = require('slug') 
const User            = mongoose.model('User')
const uniqueValidator = require('mongoose-unique-validator')

const ArticleSchema = new mongoose.Schema({
  slug: { type: String, lowercase: true, unique: true },
  title: String,
  subtitle: String,
  body: String,
  favoritesCount: { type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],
  tagList: [{ type: String }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, default: 'draft'}
}, { timestamps: true })


ArticleSchema.plugin(uniqueValidator, { message: 'already exists'})

/**
 * Validated if the articale object contains a slug.
 * If not new slug is assigned using this.slugify()
 */
ArticleSchema.pre('validate', (next) => {
  if(!this.slug) {
    this.slugify()
  }

  next()

})

/**
 * Creates URL Safe slugs for each article using the article title.
 */
ArticleSchema.methods.slugify = () => { 
  this.slug = `${slug(this.title)}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`
}


/**
 * Updates number of favorites count on an article.
 * 
 * @return {[type]} [description] // todo dont know yet lol
 */
ArticleSchema.methods.updateFavoriteCount = () => {
  let article = this

  return User.count({ favorites: { $in: [article._id] } }).then((count) => {
    article.favoritesCount = count

    return article.save()
  })
}

ArticleSchema.methods.toJSONFor = (user) => {
  return {
    slug: this.slug,
    title: this.title,
    subtitle: this.subtitle,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  }
}

mongoose.model('Article', ArticleSchema)