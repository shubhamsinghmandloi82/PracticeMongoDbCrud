const express = require('express')
var router = express.Router()


router.use('/router', require('./userRouter'))


module.exports = router