'use strict'
const express = require('express')
const api = express.Router()
const cors = require('cors')

const adminCtrl = require('../controllers/adminController')
const carCtrl = require('../controllers/carController')
const userProfileImageCtrl = require('../controllers/userProfileImageController')
const authAdmin = require('../middlewares/authAdmin')

/*************************************************************************
 * Métodos para el administrador general y administrador de cada empresa * 
*************************************************************************/
api.post('/admin/signup', authAdmin, cors(), adminCtrl.signUpAdmin)
api.post('/admin/signin', authAdmin, cors(), adminCtrl.signInAdmin)
api.get('/admin/getInformationAdmin/:adminId', authAdmin, cors(), adminCtrl.getInformationAdmin)

/**************************************************
 * Métodos para el administrador de cada empresa * 
**************************************************/
  //Mostramos los usuarios registrados
api.get('/admin/getUsersByDealershipCode/:codeDealership', authAdmin, cors(), adminCtrl.getUsersByDealershipCode)
  //Mostramos la información del usuario por codigo de empresa
api.get('/admin/getInfoUserByDealershipCode/:codeDealership', authAdmin, cors(), adminCtrl.getInfoUserByDealershipCode)
  //Buscamos al usuario por codigo que le brinda Evans
api.get('/admin/searchUserByUserCode/:codeDealership', authAdmin, cors(), adminCtrl.searchUserByUserCode)
  //Mostramos la información del auto segun userId
api.get('/admin/getCarInformation/:userId', authAdmin, cors(), carCtrl.getCarInformation)
  //Actualizamos la información del automovil
api.put('/admin/updateCarInformation/:userId', authAdmin, cors(), carCtrl.updateCarInformation)
  //Mostramos la información de la imagen de perfil del usuario
api.get('/admin/getUserProfileImage/:codeDealership?/:userId', authAdmin, cors(), userProfileImageCtrl.getUserProfileImage)
  //actualizamos - Validamos o denegamos la imagen de perfil del usuario
api.put('/admin/validateUserProfileImage/:codeDealership?/:userId', authAdmin, cors(), userProfileImageCtrl.validateUserProfileImage)
  //actualizamos - Validamos o denegamos la imagen de perfil del usuario
api.put('/admin/activateAccountAsDriver/:codeDealership?/:userId', authAdmin, cors(), adminCtrl.activateAccountAsDriver)
  //Mostramos información de los usuarios que están habilitados como conductores
api.get('/admin/getUsersEnabledAsDrivers/:codeDealership', authAdmin, cors(), adminCtrl.getUsersEnabledAsDrivers)

//api.get('/user/getInformation/:userId', auth, cors(), userCtrl.getInformation)
//api.put('/user/updateValues/:userId', auth, cors(), userCtrl.updateValues)
//api.put('/user/updateCoordinates/:userId', auth, cors(), userCtrl.updateCoordinates)

//api.post('/user/requestDriver/:userId',cors(),userCtrl.requestDriver)
//api.post('/user/sendFCM/:userId',cors(),userCtrl.sendFCM)

/*api.get('/private', auth, (req,res)=>{
  res.status(200).send({message: 'Tienes acceso'})
})*/

module.exports = api

/*"use strict";

const express = require("express");
const api = express.Router();
const cors = require("cors");

const coupon = require("../controllers/cuponesControl");

const activateCouponsCtrl = require("../controllers/activateCouponsController");
const admin = require("../controllers/admin");
const auth = require("../middlewares/auth");

api.post("/activateCoupon", cors(), activateCouponsCtrl.ActivateCoupon);
api.get("/cantUserDriver", auth, cors(), admin.cantUserDriver); //13/03
api.get("/DriverRatingBy/:id", auth, cors(), admin.getDriverRatingBy); //13/03
api.get("/getusers", auth, cors(), admin.GetAllUsers);
api.get("/getusers/profile/:userId", auth, cors(), admin.uProfile);
api.get("/getdrivers", auth, cors(), admin.GetAllDrivers);
api.get("/getdriver/:dni", auth, cors(), admin.getdriver);
api.get("/getdrivers/profile/:driverId", auth, cors(), admin.dProfile);
api.get("/getdrivers/document/:driverId", auth, cors(), admin.dDcocument);
api.get("/getdrivers/cardocument/:driverId", auth, cors(), admin.dDocCar);
api.put("/user/updateValues/:id", auth, cors(), admin.updateUserById);
api.put("/driver/updateValues/:id", auth, cors(), admin.updateDriverById);
api.put("/driver/update/document/:dDocId", cors(), admin.uDriverDoc);
api.put("/driver/update/cardocument/:dCarDocId", cors(), admin.uCarDriverDoc);

// registrar cupon
api.post("/createcoupon", cors(), coupon.registarCupon);
api.get("/getallcoupons", cors(), coupon.getAllCoupon);
api.delete("/deleteCoupon/:cuponId", cors(), coupon.deleteCoupon);
api.put("/updateCoupon/:cuponId", cors(), coupon.updateCoupon);

// pagos de conductores
api.get("/getallbaucher", cors(), admin.getAllBaucher);
api.get("/getBaucherById/:driverId", cors(), admin.getBaucherById);
api.delete("/deleteBaucherById/:baucherId", cors(), admin.deleteBaucherById);
api.put("/updateBaucherById/:baucherId", cors(), admin.updateBaucherById);

// registe and login
api.post("/signIn", cors(), admin.signIn);
api.post("/signUp", cors(), admin.signUp);

module.exports = api;
*/