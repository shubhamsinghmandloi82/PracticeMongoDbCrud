const express = require('express')
var router = express.Router()
var controller = require('../controller/index')
const multer = require('multer')
const{verifyTokenFn}=require('../utils/token')
//const uploads=require('../../uploads')
// multer code here for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
    }
})
const upload = multer({
    storage: storage
})


router.post('/signup', upload.single('profile_image'), controller.userController.signup)
router.post('/verifyCode', controller.userController.verifyCode)
router.post('/resendVerificationCode', controller.userController.resendVerificationCode)
router.post('/login', controller.userController.login)

router.get('/userProfile',verifyTokenFn,controller.userController.userProfile)
router.put('/updateUserProfile',verifyTokenFn,upload.single('profile_image'),controller.userController.updateUserProfile)
router.delete('/deleteUserProfile',verifyTokenFn,controller.userController.deleteUserProfile)

router.post('/changePassword',verifyTokenFn, controller.userController.changePassword)
router.post('/forgotPasswordOtp', controller.userController.forgotPasswordOtp)
router.post('/forgotPasswordChangeOtp', controller.userController.forgotPasswordChangeOtp)

router.post('/forgotPasswordLink', controller.userController.forgotPasswordLink)
router.post('/forgotPasswordChangeLink', controller.userController.forgotPasswordChangeLink)

module.exports = router