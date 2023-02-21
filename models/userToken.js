'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userTokenSchema = new Schema({
    userCreator:{ 
    	type: Schema.Types.ObjectId, 
        ref: 'User' 
    },    
    fcmCustomer: { type: String },
    fcmDriver: { type: String },     
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    codeRestPass: String
})

module.exports = mongoose.model('userToken',userTokenSchema)