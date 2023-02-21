'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const driverImgSchema = new Schema({
    driverId:{ 
        type: Schema.Types.ObjectId, 
        ref: 'Driver' },
    imgPerfil:{
        type: String,
        default: 'null'
    },
    imgUpdate:{
        type: Boolean,
        default: false
    },
    imgActivation:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('DriverImg',driverImgSchema)