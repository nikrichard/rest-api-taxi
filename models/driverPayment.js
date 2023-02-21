'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const driverPaymentSchema = new Schema({
    driverId: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    valido:{
        type: Boolean,
        default: false
    },    
    serie:{ 
        type: String,
        default: "null"
    },
    monto:{
        type: Number,
        default: 0
    },
    img:{
        type: String,
        default: "null"
    },
    fechaVaucher:{
        type: String,
        default: "null"
    },
    fechaRegistro:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('driverPayment',driverPaymentSchema)