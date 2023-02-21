'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const driverCouponSchema = new Schema({
  driverId:{
    type: Schema.Types.ObjectId,
    ref: 'Driver'
  },
  namePayment:{
    type: String,
    default: 'MyCoupons'
  },
  surNamePayment:{
    type: String,
    default: 'MyCoupons'
  },
  valor:{
    type: String,
    default: '0.00'
  },
  creationDate:{
    type: Date,
    default: Date.now()
  },
  expirationDate:{
    type: String
  }
})

module.exports = mongoose.model('DriverCoupon', driverCouponSchema)