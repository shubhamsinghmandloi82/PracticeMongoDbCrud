const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        allowNull: false
    },
    password: {
        type: String
    },
    mobile_no: {
        type: String
    },
    profile_image: {
        type: String
    },
    code: {
        type: Number
    },
    is_verified: {
        type: Boolean
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    },
    is_deleted: {
        type: Boolean
    },
    token:{
        type: String
    }
})

module.exports =  mongoose.model("User",userSchema)
