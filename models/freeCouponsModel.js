'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const couponsSchema = new Schema({
	nameCoupon:{
		type: String
	},
	price:{
		type: Number
	},
	numberCoupons:{
		type: Number
	},
	creationDate:{
		type: Date
	},
	expirationDate:{
		type: Date
	}
})

module.exports = mongoose.model('FreeCoupons', couponsSchema)