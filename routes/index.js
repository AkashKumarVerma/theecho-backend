var router = require('express').Router()

router.use('/editor', require('./editor'))

module.exports = router