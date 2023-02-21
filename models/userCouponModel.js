'use strict'
// delete
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userCouponSchema = new Schema({
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name:{
    type: String,
    required: true,
  },
  valor:{
    type: String,
    required: true
  },
  creationDate:{
    type: String
  },
  expirationDate:{
    type: String
  }
})

module.exports = mongoose.model('UserCoupon', userCouponSchema)