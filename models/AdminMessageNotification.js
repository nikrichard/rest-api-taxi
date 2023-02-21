'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment');

const AdminMessageNotificationSchema = new Schema({
    title:{
        type: String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    FHregister:{
        type:Date,
        default:moment.utc()
    },
    CreatorAdmin:{
        type:Schema.Types.ObjectId,
        ref:'Admin',
        require:true
    }
  },{ versionKey: false });

  module.exports = mongoose.model('MessageNotification', AdminMessageNotificationSchema)