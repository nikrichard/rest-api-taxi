'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const versionSchema = new Schema({
    driver:{
        type: String,
        default: "null"
    },
    user:{
        type: String,
        default: "null"
    },
    fecha:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('version',versionSchema)