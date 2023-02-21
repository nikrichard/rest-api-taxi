const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripsSchema = new Schema({
	user: {
		type: String,
		ref: 'User'
	},
	driver: {
		type: String,
		ref: 'Driver'
	},
	city:{
		type: String,
		required: true
	},
	startAddress:{
		type: String,
		required: true
	},
	destinationAddress:{
		type: String,
		required: true
	},
	startTime:{
		type: Date
	},
	finishTime:{
		type: Date
	},
	dateTrip:{
		type: Date,
		required: true
	},
	travelRate:{
		type: String,
		required: true
	},
	valuesPaymentType:{
		cash:{
			type: String
		},
		coupon:{
			type: String
		},
		creditCard:{
			type: String
		}
	},
	travelRateDiscount:{
		type:Number,
		default:0.00
	},
	latitudeOrigen:{
		type: String
	},
	longitudeOrigen:{
		type: String
	},
	latitudeDestino:{
		type: String
	},
	longitudeDestino:{
		type: String
	}
})

module.exports = mongoose.model('Trips', tripsSchema)