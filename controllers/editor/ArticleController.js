const mongoose = require('mongoose')
const User = mongoose.model('User')
const Comment = mongoose.model('EditorComment')
const Article = mongoose.model('EditorArticles')
const slug = require('slug')

const getArticleById = async (req, res, next) => {
  const { id } = req.body
  const article = await Article.findOne({ _id: id })
  
  if(!article) {
    return res.json({
      status: 'FAILED',
      error: {
        code: 'notFound',
        message: 'No article found for the given id.'
      }
    })
  }

  res.json({
    status: 'OK',
    data: {
      article
    }
  })
}


const addArticle = async (req, res, next) => {
  const { articleId } = req.body
  console.log(articleId)
  res.json({
    article: articleId
  })
}


module.exports = {
  getArticleById,
  addArticle
}