'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const driverDocumentsSchema = Schema({
    driverId:{ 
    	type: Schema.Types.ObjectId, 
    	ref: 'Driver' 
    },
    policeRecordCert:{ //Imagen de parte frontal de DNI
    	type: String,
    	default: 'null'
    },
    criminalRecodCert:{ //Imagen de parte reverso de DNI
   		type: String,
   		default: 'null'
   	},
    licence:{ //Imagen de licencia de conducir
    	type: String,
    	default: 'null'
    },
    imgUpdate:{
        type: Boolean,
        default: false
    },
    imgActivation:{
        driverLicence: {
            type: Boolean,
            default: false
        },
        criminalRecod: {
            type: Boolean,
            default: false
        },
        policeRecord: {
            type: Boolean,
            default: false
        }
    }
})

module.exports = mongoose.model('DriverDocuments',driverDocumentsSchema)