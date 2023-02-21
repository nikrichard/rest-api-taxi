'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const carSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    carCode: { //Código que la empresa le da al automovil
        type: String,
        default: "none"
    },
    carActivation:{ //Clave para ver el estado de activación del auto
        type: String,
        default: "none"
    },
    carBrand:{ //Marca del vehículo
        type: String,
        default: "null"
    },
    carModel:{ //Modelo del vehículo
        type: String,
        default: "null"
    },
    yearOfProduction:{ //Año del vehiculo
        type: String,
        default: "null"
    },
    carColor:{ //Color del vehículo
        type: String,
        default: "null"
    },
    carRegistration:{ //Matrícula del vehículo
        type: String,
        default: "null"
    }
})

module.exports = mongoose.model('Car',carSchema)