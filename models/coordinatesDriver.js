'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const coordinatesDriver = new Schema({
	driverCreator: {
	    type: Schema.Types.ObjectId,
	    ref: "Driver"
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

module.exports = mongoose.model('CoordinatesDriver', coordinatesDriver)