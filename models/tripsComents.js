'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripsComent = new Schema({
    driverId: {
        type: Schema.Types.ObjectId, 
        ref: 'Driver'
    },
    comentario:{
        type: String,
        default: "null"
    },    
    estrella:{ 
        type: Number,
        default: 0
    },
    fecha:{
        type: Date,
        default: Date.now()
    },
    userId:{
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    name:{
        type: String,
        default: "null"
    }
})

module.exports = mongoose.model('tripsComent',tripsComent)