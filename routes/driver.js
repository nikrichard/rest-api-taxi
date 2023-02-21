'use strict'

const express = require('express')
const api = express.Router()
const cors = require('cors')
const serviceFCM = require('../services/serviceFCM') //Servicios de FCM
const driverCtrl = require('../controllers/driverControllers')
const auth = require('../middlewares/auth')
const registerPaymentCtrl = require('../controllers/driverPayment')

const userCtrl = require('../controllers/userControllers')


api.post('/signup', cors(), userCtrl.signUp)
api.post('/signin', cors(), userCtrl.signIn)
api.get('/getInformation/:userId',cors(), userCtrl.getInformation)
api.put('/updateValues/:userId', cors(), userCtrl.updateValues)
api.put('/updateCoordinates/:userId', cors(), userCtrl.updateCoordinates)
// forgot pass
api.post('/forgot',cors(),userCtrl.forgotPassword)
api.post('/reset/confirm',cors(),userCtrl.confirmToken)
api.post('/reset/change/:id',cors(),userCtrl.changePassword)
// validar cuenta de usuarios
api.post('/validarEmail',cors(),userCtrl.mensajevalidate)
api.post('/validate/confirm',cors(),userCtrl.confirmtokenValidate)


api.put('/updateStatus/:driverId', cors(), driverCtrl.updateStatus)
api.post('/repository/getPrice', cors(), driverCtrl.getPrice)

// obtener coordenadas del conductor
api.get('/getcoodinates/:driverId', cors(), driverCtrl.getCoordinates)
api.get('/alltrips', cors(),driverCtrl.getAllTrips)

// obtener los estados de las imagenes 

api.get('/documentStatus/:driverId', cors(),driverCtrl.documentStatus)
api.get('/baucherStatus/:driverId', cors(),driverCtrl.getBaucheStatus)

api.get('/getStarts/:driverId', cors(),driverCtrl.getDriverStarts)

//notificaciones
api.put('/aceptedNotification/:driverId',cors(),serviceFCM.aceptedNotification)
api.post('/sendNotification/:driverId',cors(),serviceFCM.sendDrivernotifications)
//pagos de drivers
api.put('/registerPayment/:driverId',cors(),registerPaymentCtrl.registerPayment)
    //HECHO JUANCHO 19-02-2020
api.post('/repository/getCalcNewPriceWithCupon/:userId',cors(),serviceFCM.CalcNewPriceWithCupon)

// 
api.put('/Trip/UpdatePaymentAmount/:TripId',cors(),serviceFCM.UpdatePaymentAmount)

api.post('/Trip/TripsMoreInfo/:tripId',cors(),serviceFCM.TripsMoreInfo)
module.exports = api