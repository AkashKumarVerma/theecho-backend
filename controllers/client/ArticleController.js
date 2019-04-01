const mongoose = require('mongoose')
const uuid = require('uuid/v1')

const ClientArticles = mongoose.model('ClientArticles')
const { extractImage, saveImage } = require('./../../helpers/Image')

const getLandingPage = async (req, res, next) => {
  const articles        = await ClientArticles.find({})
  const landingArticles = []

  for(var i = 0; i < articles.length; i++) {
    landingArticles.push({
      id: articles[i]._id,
      title: articles[i].title,
      subtitle: articles[i].subtitle,
      publishedOn: articles[i].createdAt,
      author: articles[i].author,
      slug: articles[i].slug,
      poster: articles[i].poster
    })
  }

  res.status(200)
    .send({
      articles: landingArticles
    })
}

const getArticleBySlug = async (req, res, next) => {
  const { slug } =  req.params
  let article  =  await ClientArticles.findOne({ slug: slug })

  res.json(article)
}

const image = async (req, res, next) => {
  const article = await ClientArticles.find({})
  let   status  = ''

  const images  = await extractImage(article[0].body)
  
  for ( let j = 0; j < images.length; j++) {
    const name = uuid()
    status     = await saveImage(images[j], article[0]._id, name)
  }

  res.status(200)
    .send(status)
}

module.exports = {
  getLandingPage,
  getArticleBySlug,
  image
}