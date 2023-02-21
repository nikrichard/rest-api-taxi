"use strict";

const express = require("express");
const api = express.Router();
const cors = require("cors");
const auth = require("../middlewares/auth");
const userCtrl = require("../controllers/userControllers");
const tripService = require("../controllers/tripServiceController");

const serviceFCM = require("../services/serviceFCM"); //Servicios de FCM

const customer = require("../controllers/customerController");

const referido = require("../controllers/referidos");

/*api.post("/signup", cors(), userCtrl.signUp);
api.post("/signin", cors(), userCtrl.signIn);
api.get("/getInformation/:userId", cors(), userCtrl.getInformation);
api.put("/updateValues/:userId", cors(), userCtrl.updateValues);
api.put("/updateCoordinates/:userId", cors(), userCtrl.updateCoordinates);
// forgot pass
api.post("/forgot", cors(), userCtrl.forgotPassword);
api.post("/validate/password/:id", cors(), userCtrl.validateResetPass);
api.post("/reset/confirm/:id", cors(), userCtrl.confirmToken);
api.post("/reset/change/:id", cors(), userCtrl.changePassword);
// validar cuenta de usuarios
api.post("/validarEmail", cors(), userCtrl.mensajevalidate);
api.post("/validate/confirm", cors(), userCtrl.confirmtokenValidate);

api.post("/requestDriver/:userId", cors(), serviceFCM.notificationAllDriver);
api.post("/sendNotification/:userId", cors(), serviceFCM.sendUsernotifications);

// comentar y valorar viajes
api.post("/valorarviaje/:driverId", cors(), customer.comentarViajeDriver);

//editar estado
api.put("/statusTrip/:tripId", cors(), serviceFCM.statusTrip);
api.get("/getStatusTrip/:tripId", cors(), serviceFCM.getStatusTrip);
api.delete("/trip/:tripId", cors(), serviceFCM.deleteTrip);
//Pedir viaje
api.post("/getTrip/:userId", cors(), tripService.perdirDrivers);
//LISTAR CUPON
api.get("/ListCouponsUser/:userId", cors(), serviceFCM.ListCouponsUser);
api.get("/ListTripsUser/:userId", cors(), serviceFCM.ListTripsUser);

//cupones richard
api.get("/getCoupones/:userId", cors(), userCtrl.getCoupones);

//referidos
api.get("/getEwallet/:id", cors(), referido.getCodigoReferido); //id quien quiere referir
api.put("/userPutReferido/:id", cors(), referido.userPutReferido); //id del referido

// listar viajes
api.get("/getTravels/:userId", cors(), customer.listAllTravel);
api.get("/getOneTavelsInfo/:travelId", cors(), customer.getOneTravelStory);
//get  referido existe?
api.get("/findReferido/:key", cors(), referido.findReferido);*/

module.exports = api;
