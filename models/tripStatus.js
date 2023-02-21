const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripStatusSchema = new Schema({
	tripId:{
		type: String,
		ref: 'Trips'
	},
	tripCancell: {
		type: Boolean,
		default: false
	},		
	tripAccepted:{
		type: Boolean,
		default: false
	},
	tripInitiated:{
		type: Boolean,
		default: false
	},
	tripFinalized:{
		type: Boolean,
		default: false
	}
})

module.exports = mongoose.model('tripStatus', tripStatusSchema)