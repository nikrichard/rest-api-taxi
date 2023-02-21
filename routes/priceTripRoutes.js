'use strict'
const express = require('express')
const api = express.Router()
const cors = require('cors')

const priceTripCtrl = require('../controllers/priceTripController')
const auth = require('../middlewares/auth')

api.get('/customer/getPriceTrip/:codeDealership', auth, cors(), priceTripCtrl.getPriceTrip)

module.exports = api