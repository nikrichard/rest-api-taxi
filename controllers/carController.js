"use strict"
const Car = require("../models/carModel");
const db = require("../services/firebase").db;

//Método para traer información del auto
async function getCarInformation(req, res) {
  const userId = req.params.userId;

  try {
    const car = await Car.findOne({ userId: userId },(error)=>{
      if(error){
        res.status(500).json({
          status:false, 
          message: `Error al buscar información: ${error}`
        })
      }
    });
    if(!car){
      res.status(404).json({
        status: true, 
        message: `La movilidad no existe`
      })
    }else{
      res.status(200).json({
        status:true, 
        car: car
      })
    }
  } catch (error) {
    res.status(500).json({
      status:true, 
      message: `Error al realizar la petición: ${error}`
    })
  }
  
}

//Función para actualizar y/o registrar datos del automovil
async function updateCarInformation(req,res){
  const userId = req.params.userId
  const codeDealership = req.body.codeDealership
  const carCode = req.body.carCode
  const carActivation = req.body.carActivation
  const carBrand = req.body.carBrand
  const carModel = req.body.carModel
  const yearOfProduction = req.body.yearOfProduction
  const carColor = req.body.carColor
  const carRegistration = req.body.carRegistration
  
  const updateCarInformation = {
      carCode: carCode,
      carActivation: carActivation,
      carBrand: carBrand,
      carModel: carModel,
      yearOfProduction: yearOfProduction,
      carColor: carColor,
      carRegistration: carRegistration
  };
  try {
    const carInformation = await Car.findOneAndUpdate({userId: userId}, updateCarInformation, {new: true})
    if(!carInformation){
      return res.status(404).json({ 
        status: false, 
        message: "No existe el automovil" 
      });
    }else{
      const topic = `settingDriver/${codeDealership}/${userId}/carInformationFirebase`;
      const ref = db.ref(topic);
      ref.update(updateCarInformation);
      return res.status(200).json({
        status: true, 
        message: "Se actualizó correctamente la información" 
      });
    }

  } catch (error) {
    res.status(500).json({
      status:true, 
      message: `Error al realizar la petición: ${error}`
    })
  }
}

module.exports = {
  getCarInformation,
  updateCarInformation
};