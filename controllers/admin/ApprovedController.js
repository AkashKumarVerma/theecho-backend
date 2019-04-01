const mongoose         = require('mongoose')
const EditorArticles   = mongoose.model('EditorArticles')
const ClientArticles   = mongoose.model('ClientArticles')

const getApprovedArticles = async (req, res, next) => {
  const articles = await EditorArticles.find({})

  let articleList = []

  for(var i = 0; i < articles.length; i++) {
    if(articles[i].stage === 'APPROVED') {
      articleList.push(articles[i]._id)
    }
  }

  res.json({
    status: 'OK',
    value: {
      articles: articleList
    }
  })
}



const getApprovedArticlesSkeleton = async (req, res, next) => {
  const { id } = req.params
  const EditorArticle = await EditorArticles.findOne({ _id: id })

  const article = {
    title: EditorArticle.title.html,
    subtitle: EditorArticle.subtitle.html,
    author: EditorArticle.author
  }

  res.json({
    status: 'OK',
    value: {
      article
    }
  })
}


/**
 * 
 * @param {String} articleId Id of the article that needs to be published. 
 * @param {String} adminId Id on the admin who published the article.
 * 
 */
const publishArticle = async (req, res, next) => {
  const { articleId, adminId } = req.body

  console.log(articleId, adminId)
  console.log(`Searching fo ${articleId}`)
  
  // Get article to be saved.
  const article = await EditorArticles.findOne({ _id: articleId })
  
  // Creating a temp 
  const publish = {
    title: article.title.html,
    subtitle: article.subtitle.html,
    body: article.body.html,
    slug: article.slug,
    parent: article._id,
    publishedBy: adminId,
    author: article.author,
    poster: article.poster
  }

  const publishedArticle = new ClientArticles(publish)

  publishedArticle.save()
    .then(() => {
      console.log('Article Saved. Updating User article list')
      EditorArticles.updateOne({ _id: articleId }, { stage: 'PUBLISHED' })
        .then(() => {
          res.json({
            status: 'OK',
            value: {
              article: publishedArticle
            }
          })  
        })
    }).catch((err) => {
      res.json({
        status: 'OK',
        value: {
          article: publishedArticle
        }
      })
    })
}


module.exports = {
  getApprovedArticles,
  publishArticle,
  getApprovedArticlesSkeleton
}