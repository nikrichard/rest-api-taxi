'use static'
const Dealership = require('../models/dealershipModel')
const Calculates = require('../repository/priceRepository');

//Método para calcular el precio según el código de empresa
async function getPriceTrip(req,res){
  const codeDealership = req.params.codeDealership
  const originLatitude = req.query.originLatitude
  const originLongitude = req.query.originLongitude 
  const destinationLatitude = req.query.destinationLatitude
  const destinationLongitude = req.query.destinationLongitude
  
  try {
    const codeDealershipSearch = await Dealership.findOne({codeDealership: codeDealership}, (error)=>{
      if(error){
        return res.status(500).json({
          success: false,
          message: "Error al buscar dealership"
        })    
      }
    })
    if(!codeDealershipSearch){
      return res.status(404).json({
        success: true,
        message: "El código no existe"
      })    
    }else{
      const priceTrip = await Calculates.calculatePriceTrip(
        codeDealership,
        originLatitude, 
        originLongitude,
        destinationLatitude,
        destinationLongitude
      );
    
      return res.status(200).json({
        success: true,
        priceTrip: priceTrip
      })
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error: ${error}`
    })
  }
  
}

module.exports = {
    getPriceTrip
}

/*
const Coordinates = require('../models/coordinatesUser')
const DriverDocuments = require('../models/driverDocuments')
const CarMoldel = require('../models/carModel')
const CarDoc = require('../models/carDocumentsModel')
const BaucherDriver = require('../models/driverPayment')
const DriverStart = require('../models/driversstars')
const User = require('../models/userModel')

const moment =require('moment');

//Método para calcular el precio según el código de empresa
async function getPriceTrip(req,res){
    const codeDealership = req.body.codeDealership
    const originLatitude = req.body.originLatitude
    const originLongitude = req.body.originLongitude 
    const destinationLatitude = req.body.destinationLatitude
    const destinationLongitude = req.body.destinationLongitude
  
    const priceTrip = await Calculates.calculatePriceTrip(
      codeDealership,
      originLatitude, 
      originLongitude,
      destinationLatitude,
      destinationLongitude);
  
    /*let a = moment.utc(Date.now()).format("HH");
    const porcentaje = 1.17;
    a = Number(a);  // utc -5 hrs
    let b;
    // de 5 am a 7 pm o de
    if(a>=4 && a<10) {      
      b = parseFloat(precios.ecoEvans) * porcentaje;
      b = Math.round( b * 10 ) / 10;
      return res.status(200).json({"travelRate":{"ecoEvans": b+'0'}});      
    }
    else return res.status(200).json({"travelRate":precios})
  
    return res.status(200).json({priceTrip: priceTrip})
    
  }*/