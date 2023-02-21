'use strict'
const express = require('express')
const api = express.Router()
const cors = require('cors')

const dealershipCtrl = require('../controllers/dealershipController')

api.post('/dealership/registration', cors(), dealershipCtrl.registrationDealership)
api.get('/dealership/getDealerships', cors(), dealershipCtrl.getAllDealerships)
api.get('/dealership/getDealershipByCode/:codeDealership', cors(), dealershipCtrl.getDealershipByCode)
api.delete('/dealership/deleteDealership/:codeDealership', cors(), dealershipCtrl.deleteDealership)
api.put('/dealership/updateDealershipByCode/:codeDealership', cors(), dealershipCtrl.updateDealershipByCode)

module.exports = api