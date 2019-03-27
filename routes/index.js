var router = require('express').Router()

router.use('/editor', require('./editor'))
router.use('/admin', require('./admin'))
router.use('/client', require('./client'))

module.exports = router