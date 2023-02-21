'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const activateCouponsSchema = new Schema({
	monto:{
		type: String,
		default: '3.00'
	},
	status:{
		type: Boolean,
		default: true
	},
	name:{
		type: String,
		default: 'First trip'
	},
	statusNumberCoupons:{
		type: Boolean,
		default: false
	},
	numberCoupons:{
		type: Number,
		default: 20
	}
})

module.exports = mongoose.model('activateCoupons', activateCouponsSchema)