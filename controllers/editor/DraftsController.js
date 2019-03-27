const mongoose       = require('mongoose')
const slug           = require('slug')
const Editors        = mongoose.model('User')
const Article        = mongoose.model('Article')
const EditorDrafts   = mongoose.model('EditorDrafts')
const EditorArticles = mongoose.model('EditorArticles')

const getDraftById = async (req, res, next) => {

  const { id } = req.params
  const draft = await EditorDrafts.findOne({ _id: id })

  if(!draft) {
    return res.json({
      status: 'FAILED',
      error: {
        code: 'notFound',
        message: 'No draft found for the given id.'
      }
    })
  }

  res.json({
    status: 'OK',
    value: {
      draft: draft
    }
  })
}


/**
 * Returns just the Title and subtitle of the drafts provided an array of
 * draft id's. Used primarly for showing drafts list on draft page on editor.
 * 
 * @param  { array }   req.body  Array containing id's of drafts.
 * @return { array }             Array containing draft title, subtitle
 *                               of the draft and other details.
 */
const getDraftSkeleton = async (req, res, next) => {
  const { id } = req.params
  const editorDraft = await EditorDrafts.findOne({ _id: id })

  if(!editorDraft) {
    return res.json({ 
      status: 'FAILED',
      error: {
        code: 'notFound',
        message: 'No draft found for the given id.'
      }
    })
  }

  res.json({
    status: 'OK',
    value: {
      draft: {
        id: editorDraft._id,
        title: editorDraft.title,
        subtitle: editorDraft.subtitle
      }
    }
  })
  // const oldArticle = await Article.findOne({ _id: id })


  // To Save previos articles to new databse.
  //
  // const newDraft = {
  //   _id: oldArticle._id,
  //   slug: oldArticle.slug,
  //   title: oldArticle.title,
  //   subtitle: oldArticle.subtitle,
  //   body: oldArticle.body,
  //   poster: oldArticle.poster,
  //   liked: oldArticle.liked,
  //   comments: oldArticle.comments,
  //   tags: oldArticle.tagList,
  //   genre: '',
  //   author: oldArticle.author,
  //   createdAt: oldArticle.createdAt,
  //   updatedAt: oldArticle.updatedAt,
  //   stage: oldArticle.stage
  // }

  // const ee = new EditorDrafts(newDraft)

  // ee.save()
  //   .then((response) => {
  //     res.send(response)
  //   })

  // // console.log(temp)
  // ee.save()
  //   .then(() => {
  //     res.json({
  //       draft: ee
  //     })
  //   }).catch((err) => {
  //     console.log(err)
  //   })
}


/**
 * To save articles as drafts for a user.
 * @return {[type]}        [description]
 */
const addDraft = async (req, res, next) => {

  const { id }    = req.body
  const userDraft = req.body.draft
  const editor    = await Editors.findById(id)

  console.log('Saving Draft', userDraft)

  if (!editor) {
    res.json({
      status: 'FAILED',
      error: {
        code: 'AuthorizationError',
        message: 'Author of the article not found in user database.'
      }
    })
  }

  let   draftSlug    = ''
  const draft        = new EditorDrafts(userDraft)
  const oldDrafts    = editor.drafts

  // For generating slug only when draft has a title.
  if(draft.title.html) {
    let title = draft.title.html.replace(/(<([^>]+)>)/ig, '')
    draftSlug = `${slug(title, {lower: true})}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`
  }

  draft.author = editor
  draft.slug   = draftSlug
  draft.stage  = 'DRAFT'

  draft.save()
    .then(() => {
      if (!oldDrafts.includes(draft._id)) {
        Editors.update({ _id: id }, { $push: { drafts: [ draft._id ] }})
          .then(() => {
            res.json({
              status: 'OK',
              value: {
                draft: draft.toJSONFor(editor) 
              }
            })
          })
      }
    }).catch((err) => {
      res.json({
        status: 'FAILED',
        error: {
          code: 'InternalError',
          message: 'Something went wrong. Please try again.'
        }
      })
    })
}


const updateDraft = async (req, res, next) => {
  const draftId = req.body.draft.id
  const draft = req.body.draft

  const query = { _id: draftId }

  EditorDrafts.findOneAndUpdate(query, {
    title: draft.title,
    subtitle: draft.subtitle,
    body: draft.body,
    poster: draft.poster
  }).then((draft) => {
    res.json({
      status: 'SUCCESS',
      value: {
        draft
      }
    })
  }).catch((err) => {
    res.json({
      error: {
        code: 'updateFailed',
        message: err
      }
    })
  })
  
  // res.json(req.body.draft.id)
}


const submitDraft = async (req, res, next) => {
  const { userId, draftId } = req.body

  const editor      = await Editors.findById(userId)
  const editorDraft = await EditorDrafts.findById(draftId)

  const { _id, ...article } = editorDraft
  const editorArticle       = new EditorArticles(article._doc)

  editorArticle.stage = 'REVIEW'

  // console.log(editorArticle._id);
  // res.send({
  //   status: 'OK',
  //   value: {
  //     article: editorArticle
  //   }
  // })
  

  editorArticle.save()
    .then(() => {
      editor.articles.push(editorArticle._id)
      editor.drafts.pull(editorDraft._id)
      editor.save()
        .then(() => {
          res.json({
            status: 'OK',
            value: {
              article: editorArticle.toJSONFor(editor)
            }
          })
        })
    }).catch((err) => {
      res.json({
        status: 'FAILED',
        error: {
          code: 'InternalError',
          message: 'Something went wrong. Please try again.'
        }
      })
    })  
  // editorArticle.save()
  //   .then(() => {
  //     Editors.updateOne(
  //       { _id: userId }, 
  //       { $pull: { drafts: editorDraft._id } }, 
  //       { $push: { articles: editorArticle._id } }
  //     ).then(() => {
  //       res.json({
  //         status: 'OK',
  //         value: {
  //           draft: editorArticle.toJSONFor(editor) 
  //         }
  //       })
  //     })
  //   }).catch((err) => {
  //     res.json({
  //       status: 'FAILED',
  //       error: {
  //         code: 'InternalError',
  //         message: 'Something went wrong. Please try again.'
  //       }
  //     })
  //   })
}


module.exports = {
  getDraftSkeleton,
  getDraftById,
  addDraft,
  submitDraft,
  updateDraft
}