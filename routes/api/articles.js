const router = require('express').Router()
const mongoose = require('mongoose')
const Article = mongoose.model('Article')
const Comment = mongoose.model('Comment')
const User = mongoose.model('User')
const auth = require('../auth')

router.param('article', (req, res, next, slug) => {
  Article.findOne({ slug: slug })
    .populate('author')
    .then((article) => {
      if(!article) {
        return res.sendStatus(404)
      }

      req.article = article

      return next()
    }).catch(next)
})

router.param('comment', (req, res, next, id) => {
  Comment.findById(id).then((comment) => {
    if(!comment) { return res.sendStatus(404) }

    req.comment = comment

    return next()
  }).catch(next)
})

router.get('/', auth.optional, (req, res, next) => {
  let query = {}
  let limit = 20
  let offset = 0

  if(typeof req.query.limit !== 'undefined') {
    limit = req.query.limit
  }

  if(typeof req.query.offset !== 'undefined') {
    offset = req.query.offset
  }

  if(typeof req.query.tag !== 'undefined') {
    query.tagList = {"$in": [req.query.tag]}
  }

  Promise.all([
    req.query.author ? User.findOne({ username: req.query.author }) : null,
    req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
  ]).then((results) => {
    console.log('Inside Promise All')
    console.log(results)
    const author = results[0]
    const favoriter = results[1]

    if(author) {
      query.author = auther._id
    }

    if(favoriter) {
      query._id = { $in: favoriter.favorites }
    } else if(req.query.favorited) {
      query._id = { $in: [] }
    }

    return Promise.all([
      Article.find()
    ])
  })
})
