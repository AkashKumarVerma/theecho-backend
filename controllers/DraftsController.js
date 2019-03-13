const mongoose = require('mongoose')
const User = mongoose.model('User')
const Article = mongoose.model('Article')
const slug = require('slug')

const getDraftById = async (req, res, next) => {

  const { id } = req.params
  const draft = await Article.findOne({ _id: id })

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
  const draft = await Article.findOne({ _id: id })

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
      draft: {
        id: draft._id,
        title: draft.title,
        subtitle: draft.subtitle
      }
    }
  })

}


/**
 * To save articles as drafts for a user.
 * @return {[type]}        [description]
 */
const addDraft = async (req, res, next) => {
  const { id }    = req.body
  const userDraft = req.body.draft
  const user      = await User.findById(id)

  console.log('Saving Draft', userDraft)
  if (!user) {
    res.json({
      status: 'FAILED',
      error: {
        code: 'AuthorizationError',
        message: 'Author of the article not found in user database.'
      }
    })
  }

  let   draftSlug    = ''
  const draft        = new Article(userDraft)
  const oldDrafts    = user.drafts

  // For generating slug only when draft has a title.
  if(draft.title.html) {
    let title = draft.title.html.replace(/(<([^>]+)>)/ig, '')
    draftSlug = `${slug(title, {lower: true})}-${(Math.random() * Math.pow(36, 6) | 0).toString(36)}`
  }

  draft.author = user
  draft.slug   = draftSlug
  draft.stage  = 'DRAFT'

  draft.save()
    .then(() => {
      if (!oldDrafts.includes(draft._id)) {
        User.update({ _id: id }, { $push: { drafts: [ draft._id ] }})
          .then(() => {
            res.json({
              status: 'OK',
              value: {
                draft: draft.toJSONFor(user) 
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



module.exports = {
  getDraftSkeleton,
  getDraftById,
  addDraft
}