'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const coordinatesUser = new Schema({
	userCreator: {
	    type: Schema.Types.ObjectId,
	    ref: "User"
  	},
  	latitude: {
  		type: String, 
  		required: true, 
  		default: 'null'
  	},
  	longitude: {
  		type: String, 
  		required: true, 
  		default: 'null'
  	}
})

module.exports = mongoose.model('CoordinatesUser', coordinatesUser)