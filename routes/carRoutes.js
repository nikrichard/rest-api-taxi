'use strict'

const express = require('express')
const api = express.Router()
const cors = require('cors')

const carCtrl = require('../controllers/carController')
const auth = require('../middlewares/auth')

//api.post('/createCar/:userId', cors(), carCtrl.createCar)

module.exports = api

