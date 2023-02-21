'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userCouponSchema = new Schema({
    userId:{ 
    	type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    couponId:{ 
    	type: Schema.Types.ObjectId, 
        ref: 'Coupon' 
    },
    isUsed:{
      type: Boolean,
      default: false
    },
    value:{
      type:Number
    }
  });

module.exports = mongoose.model('userCoupon', userCouponSchema)