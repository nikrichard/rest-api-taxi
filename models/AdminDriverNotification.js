'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment');

const AdminDriverNotificationSchema = new Schema({
    state:{
        type:Boolean,
        default:false
    },
    FHread:{
        type:Date,
        default:null
    },
    FHsend:{
        type:Date,
        default:moment.utc()
    },
    Driver:{
        type:Schema.Types.ObjectId,
        ref:'Driver',
        require:true
    },
    Message:{
        type:Schema.Types.ObjectId,
        ref:'MessageNotification',
        require:true
    }
  },{ versionKey: false });

  module.exports = mongoose.model('AdminDriverMsgNotification', AdminDriverNotificationSchema)