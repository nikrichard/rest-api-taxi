'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const referidoSchema = new Schema({
    value:{ type: Number, default:0 },
    name:{ type: String },
    key:{ type: String },
    creator:{ type: Schema.Types.ObjectId },
    cant:{ type: Number, default:0 },
  });

module.exports = mongoose.model('Referido', referidoSchema)