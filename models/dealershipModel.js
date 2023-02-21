'use strict'
const mongoose = require('mongoose')
const Schema =  mongoose.Schema
const bcrypt = require('bcryptjs')

const dealershipSchema = new Schema({
    codeDealership: {
        type: String,
        required: true
    },
    nameDealership: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    departament: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    locality: {
        type: String,
        required: true
    },
    activateDealership:{
        type: Boolean,
        default: false
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Dealership', dealershipSchema)