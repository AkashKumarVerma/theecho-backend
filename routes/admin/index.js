const router = require('express').Router()

router.use('/users', require('./user'))
router.use('/submissions', require('./submissions'))
router.use('/approvals', require('./approvals'))
// router.use('/drafts', require('./drafts'))
// router.use('/profiles', require('./profiles'))
// router.use('/articles', require('./articles'))
// router.use('/tags', require('./tags'))

module.exports = router