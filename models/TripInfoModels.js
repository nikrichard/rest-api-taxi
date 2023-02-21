'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TripInfo = new Schema({
    tripId: {
        type: Schema.Types.ObjectId, 
        ref: 'Trips',
        require:true
    },
    nameDriver:{
        type: String,
        require:true
    },    
    PlacaCAr:{ 
        type: String,
        require:true
    },
    modelCar:{
        type: String,
        require:true
    },
    HourStart:{
        type: String, 
        default:Date.now()
    },
    HourEnd:{
        type: String,
        default: Date.now()
    }
})

module.exports = mongoose.model('TripsMoreInfo',TripInfo)