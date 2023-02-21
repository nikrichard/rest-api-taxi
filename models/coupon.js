'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cuponesSchema = new Schema({
    date:{
      type: Date,
      default: Date.now(),
    },
    value:{
      type: Number
    },
    cant:{
      type: Number
    },
    expire:{
      type: Date
    },
    name:{
      type: String
    },
    key:{
      type: String
    },
    expireuser:{
      type: Date
    },
    creator:{
      type: Schema.Types.ObjectId
    }
  });

module.exports = mongoose.model('Coupon', cuponesSchema)