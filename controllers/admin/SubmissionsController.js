const mongoose       = require('mongoose')
const Admins         = mongoose.model('Admins')
const EditorArticles = mongoose.model('EditorArticles')
const ReviewSlips    = mongoose.model('ReviewSlips')

const getSubmissions = async (req, res, next) => {
  const submissions = await EditorArticles.find({})
  let idList = []
  console.log('Inside getSubmissions')
  for (let i = 0; i < submissions.length; i++) {
    if(submissions[i].stage === 'REVIEW') {
      console.log(`Stage ${submissions[i].stage}`)
      idList.push(submissions[i]._id)
    }
  }

  res.send({
    status: 'OK',
    value: {
      submissions: idList
    }
  })
}


const getSubmissionSkeleton = async (req, res, next) => {
  const { id } = req.params
  const submission = await EditorArticles.findOne({ _id: id })

  let submissionSkeleton = {
    id: submission._id,
    title: submission.title.html,
    subtitle: submission.subtitle.html,
    author: submission.author,
    submittedOn: submission.createdAt
  }

  res.send({
    status: 'OK',
    value: {
      submission: submissionSkeleton
    }
  })

}

const approveSubmission = async (req, res, next) => {

 const { adminId, articleId } = req.body

 const article = await EditorArticles.findOne({ _id: articleId })
 const admin   = await Admins.findOne({ _id: adminId })

 const slipData = {
  articleId: article._id,
  admin: admin._id,
  verdict: 'APPROVED'
 }

 const slip = new ReviewSlips(slipData)

 slip.save()
  .then(() => {
    EditorArticles.updateOne({ _id: articleId }, { stage: 'APPROVED' })
      .then(() => {
        res.json({
          status: 'OK',
          value: {
            slip
          }
        })
      }).catch((err) => {
        res.json({
          status: 'FAILED',
          error: {
            code: 'InternalError',
            message: 'Failed to update article stage. Please try again.'
          }
        })      
      })
  }).catch((err) => {
    res.json({
      status: 'FAILED',
      error: {
        code: 'InternalError',
        message: 'Failed to approve article. Please try again.'
      }
    })
  })
}

module.exports = {
  getSubmissions,
  getSubmissionSkeleton,
  approveSubmission
}