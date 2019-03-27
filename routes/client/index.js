const router = require('express').Router()

router.use('/landing', require('./landing'))

module.exports = router