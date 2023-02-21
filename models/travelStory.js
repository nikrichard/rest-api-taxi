const mongoose = require('mongoose')
const Schema = mongoose.Schema

const travelStorySchema = new Schema({
    user: {type: String,ref: 'User'},
    driver: {type: String,ref: 'Driver'},
    car:{type: String,ref: 'Car'},
    trip:{type: String,ref: 'Trips'},
    tripStatus:{type: String,ref: 'tripStatus'},
})

module.exports = mongoose.model('TravelStory', travelStorySchema)