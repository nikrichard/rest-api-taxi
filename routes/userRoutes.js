'use strict'

const express = require('express')
const api = express.Router()
const cors = require('cors')

const userCtrl = require('../controllers/userControllers')
const userProfileImageCtrl = require('../controllers/userProfileImageController')
const auth = require('../middlewares/auth')

api.post('/user/checkIfEmailExists', cors(), userCtrl.checkIfEmailExists)
api.post('/user/signupUser', cors(), userCtrl.signUpUser)
api.post('/user/signinUser', cors(), userCtrl.signInUser)
api.get('/user/getInformation/:userId', auth, cors(), userCtrl.getInformationUser)

  //Actualizamos la información del la imagen de perfil del usuario
api.put('/user/updateUserProfileImage/:codeDealership?/:userId', auth, cors(), userProfileImageCtrl.updateUserProfileImage)
  //Despertamos al pendejo de Heroku
api.post('/user/apiActivate/:codeDealership', auth, cors(), userProfileImageCtrl.apiActivate)

/*

api.get('/user/getInformation/:userId', auth, cors(), userCtrl.getInformation)
api.put('/user/updateValues/:userId', auth, cors(), userCtrl.updateValues)
api.put('/user/updateCoordinates/:userId', auth, cors(), userCtrl.updateCoordinates)

api.post('/user/requestDriver/:userId',cors(),userCtrl.requestDriver)
api.post('/user/sendFCM/:userId',cors(),userCtrl.sendFCM)*/

api.get('/private', auth, (req,res)=>{
  res.status(200).send({message: 'Tienes acceso'})
})

module.exports = api

/*'use strict'

const express = require('express')
const api = express.Router()
const cors = require('cors')
const userCtrl = require('../controllers/userControllers')
const serviceFCM = require('../services/serviceFCM') //Servicios de FCM



api.post('/sendEmail', cors(), userCtrl.sendEmailToValidate)
api.post('/validateEmail', cors(), userCtrl.confirmNewEmail)
api.put('/statusTrip/:tripId',cors(), serviceFCM.statusTrip)
api.get('/getStatusTrip/:tripId',cors(), serviceFCM.getStatusTrip)
 


module.exports = api*/