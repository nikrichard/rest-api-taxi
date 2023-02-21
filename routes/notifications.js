'use strict'

const express = require('express')
const api = express.Router()
const cors = require('cors')
const auth = require('../middlewares/auth')
const notificationCtrl = require('../controllers/notificationControllers')

api.get('/getInformationDriver/:driverId', cors(), notificationCtrl.getInformationDriver)

module.exports = api