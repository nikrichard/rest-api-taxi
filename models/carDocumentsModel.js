'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const carDocumentsSchema = new Schema({
    carId: { 
    	type: Schema.Types.ObjectId, 
    	ref: 'Car' 
    },
    soatFront:{
    	type: String,
    	default: "null"
    },
    tarjetaPropFront:{
    	type: String,
    	default: "null"
    },
    tarjetaPropReverse:{
    	type: String,
    	default: "null"
    },
    imgActivation:{
        soatFront:{
            type: Boolean,
            default: false 
        },
        tarjetaPropFront:{
            type: Boolean,
            default: false 
        },
        tarjetaPropReverse:{
            type: Boolean,
            default: false 
        }
    }
})

module.exports = mongoose.model('CarDocuments',carDocumentsSchema)