 const user = require('../model/user')
 const bcrypt = require('bcryptjs')
 const emailSend = require('../utils/email')
 const forgotEmailSendOtp= require('../utils/forgotEmailOtp')
 const forgotEmailSend = require('../utils/forgotEmail')
 const {
     issueJWT
 } = require('../utils/token')

 module.exports.signup = async (req, res) => {
     try {
         var otp = Math.floor(100000 + Math.random() * 900000);
         let {
             name,
             email,
             password,
             mobile_no
         } = req.body
         let profile_image = req.file.originalname;

         let checkUser = await user.findOne({
             email
         })
         if (checkUser == null) {
             let salt = await bcrypt.genSaltSync(10);
             let hashPassword = await bcrypt.hash(password, salt);
             let emailSendFunction = await emailSend.mail(email, otp, name);

             let userObject = new user({
                 name,
                 email,
                 password: hashPassword,
                 mobile_no,
                 profile_image,
                 code: otp,
                 is_verified: 0,
                 is_deleted: 0
             })
             let saveUser = await userObject.save()
             if (saveUser) {
                 res.json({
                     status: true,
                     statusCode: 201,
                     message: "New User Created Successfully",
                     data: saveUser
                 })
             } else {
                 res.json({
                     status: false,
                     statusCode: 400,
                     message: "Something Went Wrong",
                     data: ""
                 })
             }

         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Already Exits",
                 data: ""
             })
         }
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }

 module.exports.verifyCode = async (req, res) => {
     try {
         let {
             email,
             code,
         } = req.body

         let checkUser = await user.findOne({
             email
         })
         if (checkUser) {
             console.log(checkUser.is_verified == true)

             if (checkUser.is_verified == false) {

                 if (checkUser.code == code) {
                     let updateOtp = await user.updateOne({
                         email: email
                     }, {
                         $set: {
                             is_verified: 1,
                             code: 0
                         }
                     });
                     res.json({
                         status: true,
                         statusCode: 200,
                         message: "Otp Verified Successfully",
                         data: updateOtp
                     })
                 } else {
                     res.json({
                         status: false,
                         statusCode: 200,
                         message: "You Entered a Wrong Otp .",
                         data: ""
                     })
                 }
             } else {
                 res.json({
                     status: false,
                     statusCode: 200,
                     message: "Your Account Is Already Verified",
                     data: ""
                 })
             }

         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Not Exits",
                 data: ""
             })
         }
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }


 module.exports.resendVerificationCode = async (req, res) => {
     try {
         var otp = Math.floor(100000 + Math.random() * 900000);
         let {
             email
         } = req.body

         let checkUser = await user.findOne({
             email
         })
         if (checkUser) {
             let emailSendFunction = await emailSend.mail(email, otp, checkUser.name);
             let updateUser = await user.updateOne({
                 email: email
             }, {
                 $set: {
                     code: otp
                 }
             });
             res.json({
                 status: true,
                 statusCode: 201,
                 message: "New Otp Sended To Your Email Address",
                 data: updateUser
             })

         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Not Exits",
                 data: ""
             })
         }
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }

 module.exports.login = async (req, res) => {
     try {
         let {
             email,
             password,
         } = req.body

         let checkUser = await user.findOne({
             email
         })
         if (checkUser) {
             if (checkUser.is_deleted == false) {

                 if (checkUser.is_verified == true) {

                     let checkPassword = await bcrypt.compare(password, checkUser.password)
                     if (checkPassword) {
                         //let updateOtp=await user.updateOne({_id : checkUser._id}, {$set :{is_verified:1}});
                         let payload = {
                             id: checkUser._id,
                             email: checkUser.email
                         }
                         let token = await issueJWT(payload)
                         res.json({
                             status: true,
                             statusCode: 200,
                             message: "User Login Successfully",
                             data: checkUser,
                             token: token
                         })
                     } else {
                         res.json({
                             status: false,
                             statusCode: 200,
                             message: "You Entered a Wrong Password .",
                             data: ""
                         })
                     }

                 } else {
                     res.json({
                         status: false,
                         statusCode: 200,
                         message: "This User Account Is Not Verified .",
                         data: ""
                     })
                 } //close of is verified if else

             } else {
                 res.json({
                     status: false,
                     statusCode: 200,
                     message: "This User Account Is Deleted .",
                     data: ""
                 })
             } //close of is deleted if else

         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Not Exits",
                 data: ""
             })
         } //close of valid user if else
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }

 module.exports.userProfile = async (req, res) => {
     try {
         let {
             email
         } = req.user

         let checkUser = await user.findOne({
             email
         })
         if (checkUser) {
             res.json({
                 status: true,
                 statusCode: 200,
                 message: "User Profile Showed Successfully",
                 data: checkUser
             })
         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Not Exits",
                 data: ""
             })
         }
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }

 module.exports.updateUserProfile = async (req, res) => {
     try {
         let {
             email
         } = req.user
         let {
             name,
             mobile_no
         } = req.body;

         let profile_image = req.file.originalname;
         let checkUser = await user.findOne({
             email
         })
         if (checkUser) {
             let userObject = {
                 name,
                 mobile_no,
                 profile_image
             }
             let updateUser = await user.updateOne({
                 email: email
             }, {
                 $set: userObject
             });
             res.json({
                 status: true,
                 statusCode: 200,
                 message: "User Profile Updated Successfully",
                 data: updateUser
             })
         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Not Exits",
                 data: ""
             })
         }
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }

 module.exports.deleteUserProfile = async (req, res) => {
     try {
         let {
             email
         } = req.user
         let checkUser = await user.findOne({
             email
         })
         if (checkUser) {

             let deleteUser = await user.updateOne({
                 email: email
             }, {
                 $set: {
                     is_deleted: 1
                 }
             });
             res.json({
                 status: true,
                 statusCode: 200,
                 message: "User Profile Deleted Successfully",
                 data: deleteUser
             })
         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Not Exits",
                 data: ""
             })
         }
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }

 module.exports.changePassword = async (req, res) => {
     try {
         let {
             email
         } = req.user;
         console.log(email)
         let {
             password,
         } = req.body

         let checkUser = await user.findOne({
             email
         })
         if (checkUser) {
             let salt = await bcrypt.genSaltSync(10);
             let hashPassword = await bcrypt.hash(password, salt);
             let updateUser = await user.updateOne({
                 email: email
             }, {
                 $set: {
                     password: hashPassword
                 }
             });
             res.json({
                 status: true,
                 statusCode: 201,
                 message: "User Password Changed Successfully",
                 data: updateUser
             })

         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Not Exits",
                 data: ""
             })
         }
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }

 module.exports.forgotPasswordOtp = async (req, res) => {
     try {
         var otp = Math.floor(100000 + Math.random() * 900000);
         let {
             email
         } = req.body

         let checkUser = await user.findOne({
             email
         })
         if (checkUser) {
             let emailSendFunction = await forgotEmailSendOtp.forgotEmailOtp(email, otp, checkUser.name);
             let updateUser = await user.updateOne({
                 email: email
             }, {
                 $set: {
                     code: otp
                 }
             });
             res.json({
                 status: true,
                 statusCode: 201,
                 message: "New Otp Sended To Your Email Address",
                 data: updateUser
             })

         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Not Exits",
                 data: ""
             })
         }
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }

 module.exports.forgotPasswordChangeOtp = async (req, res) => {
     try {
         let {
             email,
             code,
             password
         } = req.body

         let checkUser = await user.findOne({
             email
         })
         if (checkUser) {
             if (checkUser.code == code) {


                 let salt = await bcrypt.genSaltSync(10);
                 let hashPassword = await bcrypt.hash(password, salt);
                 let updateUser = await user.updateOne({
                     email: email
                 }, {
                     $set: {
                         password: hashPassword
                     }
                 });
                 res.json({
                     status: true,
                     statusCode: 201,
                     message: "Password Changed Successfully",
                     data: updateUser
                 })
             } else {
                 res.json({
                     status: false,
                     statusCode: 200,
                     message: "You Entered a Wrong Otp",
                     data: ""
                 })
             }

         } else {
             res.json({
                 status: false,
                 statusCode: 200,
                 message: "This User Is Not Exits",
                 data: ""
             })
         }
     } catch (error) {
         res.json({
             status: false,
             statusCode: 400,
             message: error.message,
             data: ""
         })
     }
 }

 module.exports.forgotPasswordLink = async (req, res) => {
    try {
        let {
            email
        } = req.body

        let checkUser = await user.findOne({
            email
        })
        if (checkUser) {
            
            const payload = {
                id: checkUser._id,
                email: checkUser.email
            }
            let token = await issueJWT(payload)
            let link = `http://localhost:3001/api/v1/router/${token}`

            let emailSendFunction = await forgotEmailSend.forgotEmail(email, link, checkUser.name);
            let updateUser = await user.updateOne({
                email: email
            }, {
                $set: {
                    token: token
                }
            });
            res.json({
                status: true,
                statusCode: 201,
                message: "New Link Sended To Your Email Address",
                data: updateUser
            })

        } else {
            res.json({
                status: false,
                statusCode: 200,
                message: "This User Is Not Exits",
                data: ""
            })
        }
    } catch (error) {
        res.json({
            status: false,
            statusCode: 400,
            message: error.message,
            data: ""
        })
    }
}

module.exports.forgotPasswordChangeLink = async (req, res) => {
    try {
        let {
            email,
            password
        } = req.body

        let {
            token,
        } = req.query
        
        let checkUser = await user.findOne({
            email
        })
        if (checkUser) {
            if (checkUser.token == token) {


                let salt = await bcrypt.genSaltSync(10);
                let hashPassword = await bcrypt.hash(password, salt);
                let updateUser = await user.updateOne({
                    email: email
                }, {
                    $set: {
                        password: hashPassword
                    }
                });
                res.json({
                    status: true,
                    statusCode: 201,
                    message: "Password Changed Successfully",
                    data: updateUser
                })
            } else {
                res.json({
                    status: false,
                    statusCode: 200,
                    message: "You Entered a Wrong Token",
                    data: ""
                })
            }

        } else {
            res.json({
                status: false,
                statusCode: 200,
                message: "This User Is Not Exits",
                data: ""
            })
        }
    } catch (error) {
        res.json({
            status: false,
            statusCode: 400,
            message: error.message,
            data: ""
        })
    }
}