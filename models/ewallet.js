'use strict'
const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema

const ewalletSchema = new Schema({
    value:{ type: Number, default:0 },
    user:{ type: Schema.Types.ObjectId },
    cardId:{ type: String, default:uuidv4() },
});

module.exports = mongoose.model('ewallet', ewalletSchema)