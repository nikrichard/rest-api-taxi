'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const driversStarts = new Schema({
    driverId: {
        type: Schema.Types.ObjectId, 
        ref: 'Driver'
    },
    five:{
        type: Number,
        default: 0
    },    
    four:{ 
        type: Number,
        default: 1
    },
    three:{
        type: Number,
        default: 0
    },
    two:{
        type: Number,
        default: 0
    },
    one:{
        type: Number,
        default: 0
    },
    sumatoria:{
        type: Number,
        default: 4
    },
    total:{
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('driverStart',driversStarts)