const router = require('express')

router.request('/articles', require('./articles'))

module.exports = router