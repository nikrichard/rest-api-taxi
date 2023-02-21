'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userImageSchema = new Schema({
    userId:{ 
    	type: Schema.Types.ObjectId, 
		ref: 'User'
	},
	imageActivation:{
    	type: String,
    	default: 'none'
    },
    profileImage:{
    	type: String,
    	default: 'null'
    },
    imageUpdate:{
    	type: Boolean,
    	default: false
    }
})

module.exports = mongoose.model('UserImg',userImageSchema)