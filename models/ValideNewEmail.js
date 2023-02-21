'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validateNewEmailSchema = new Schema({
    email:{
        type: String,
    },
    code:{
        type: String,
    },
    exp:{
        type: Date,
    }
})

module.exports = mongoose.model('validateNewEmail',validateNewEmailSchema)