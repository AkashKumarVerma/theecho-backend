const mongoose = require('mongoose')
const User = mongoose.model('User')
const Comment = mongoose.model('Comment')
const Article = mongoose.model('Article')
const slug = require('slug')

const getArticle = async (req, res, next) => {
  const { id } = req.body
  const article = await Article.findOne({ _id: id })
  
  if(!article) { return res.sendStatus(401) }

  res.status(200)
  res.json({
    status: 'ok',
    data: {
      article
    }
  })
}

const addArticle = async (req, res, next) => {
  const { id, article } = req.body
  const title           = article.title.html.replace(/(<([^>]+)>)/ig, '')
  const user            = await User.findById(id)
  const userArticles    = user.articles
  let newArticle        = new Article(article)

  console.log('Article Originally Saved', userArticles)
  if (!user) { 
    res.status(401)
    res.json({
      status: 'not_found',
      error: {
        type: 'NO_MATCHING_USER',
        message: 'No matching user found for author passed.'
      }
    })
  }


  newArticle.author = user
  newArticle.slug   = `${slug(title, {lower: true})}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`

  newArticle.save()
    .then(() => {
      User.update({ _id: id }, { $push: { articles: [newArticle._id] }})
        .then(() => {
          console.log('Article Now Saved', user.articles)
          res.status(200)
          res.json({
            status: 'ok',
            data: {
              article: newArticle.toJSONFor(user)
            }
          })
        })
    }).catch((err) => {
      res.staus(500)
      res.json({
        status: 'internalError',
        error: {
          value: err,
          message: 'Something went wrong. Please try again.'
        }
      })
    })
}

module.exports = {
  getArticle,
  addArticle
}