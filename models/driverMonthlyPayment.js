const mongoose = require('mongoose')
const Schema = mongoose.Schema

const driverMonthlyPaymentSchema = new Schema({
	driverId:{
		type: Schema.Types.ObjectId, 
        ref: 'Driver'
	},
	value:{
		type: String,
		default: '24.00'
	},
	status:{
		type: Boolean,
		default: true
	},
	expirationDate: {
		type: Date,
	}

})

module.exports = mongoose.model('driverMonthlyPayment', driverMonthlyPaymentSchema)