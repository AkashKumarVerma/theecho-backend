const router = require('express').Router()

router.use('/users', require('./user'))
router.use('/articles', require('./articles'))
// router.use('/profiles', require('./profiles'))
// router.use('/articles', require('./articles'))
// router.use('/tags', require('./tags'))

module.exports = router