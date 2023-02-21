'use static'

const Coordinates = require('../models/coordinatesUser')
const DriverDocuments = require('../models/driverDocuments')
const CarMoldel = require('../models/carModel')
const CarDoc = require('../models/carDocumentsModel')
const BaucherDriver = require('../models/driverPayment')
const DriverStart = require('../models/driversstars')
const User = require('../models/userModel')

//const Calculates = require('../repository/evansPrice');

const moment =require('moment');


/*//Método que retorna el precio
async function getPrice(req,res){
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

//Método que actualiza el estado del conductor(switch)
async function updateStatus(req,res){
  let driverId = req.params.driverId
  let statusSwitch = req.body.statusSwitch

  await User.findByIdAndUpdate(driverId, {statusSwitch: statusSwitch}, (err, driver)=>{
     if (err) {
      res.status(500).json({message: `Error al realizar la petición: ${err}`})
    }if (!driver) {
      res.status(404).json({message: `No existe el usuario`})
    }else{
      res.status(200).json({message: 'Estado actualizado correctamente'});
    } 
  })
}

const getCoordinates = (req,res)=>{
  const id = req.params.driverId;
  Coordinates.findOne({"userCreator":id},(err,doc)=>{
    if(err) return res.json({ok:false,err});
    if(!doc) return res.status(404).json({ok:false})
    else return res.json({ok:true,latitude:doc.latitude,longitude:doc.longitude});
  });
}

// estado de los documentos
const documentStatus = async(req,res)=>{
  const id = req.params.driverId;
  let data = {
    soatFront:false,
    tarjetaPropFront:false,
    tarjetaPropReverse:false,
    driverLicence:false,
    criminalRecod:false,
    policeRecord:false
  }
  
  try {
    const driverdoc = await DriverDocuments.findOne({"driverId":id});
    if(driverdoc.licence !== "null") data.driverLicence = true;
    if(driverdoc.criminalRecodCert == "null" || driverdoc.criminalRecodCert !== "null" ) data.criminalRecod = true; //modificado a true
    if(driverdoc.policeRecordCert == "null" || driverdoc.policeRecordCert !== "null") data.policeRecord = true; //modificado a true
    const car = await CarMoldel.findOne({"driverId":id});
    const cardoc = await CarDoc.findOne({"carId":car._id});
    if(cardoc.soatFront !== "null") data.soatFront = true;
    if(cardoc.tarjetaPropFront !== "null") data.tarjetaPropFront = true;
    if(cardoc.tarjetaPropReverse !== "null") data.tarjetaPropReverse = true;
    res.status(200).json({ok:true,data})   
  } catch (error) {
    res.status(500).json({ok:false,error});
  }
  
}

// getIformation acount activate

async function accountActivate(req,res){  
  let driverId = req.params.driverId
  try {
      const driver = await User.findById(driverId,(err)=>{
        if(err) return res.status(500).json({message: `Error al realizar la petición: ${err}`})
      })
      if(!driver) return res.status(404).json({message: 'El conductor no existe'})
      else{
        res.status(200).json({accountActivate: driver.isDriver});
      }
    } 
  catch (error) {
      res.status(500).json({error})
  }
}

const getAllTrips = async (req,res)=>{
  try {
    const stadoviajes = await Coordinates.find().populate('User')
    res.status(200).json({stadoviajes})
  } catch (error) {
    res.status(500).json({error})
  }  
}

const getBaucheStatus = async (req,res)=>{
  try {
    const id = req.params.driverId;
    const baucher = await BaucherDriver.find({"driverId" : id});
    const ultimo = baucher.length;
    if(ultimo > 0){
      if(baucher[ultimo-1].img !== 'null'){
        res.status(200).json({estadoimg:true,acceptimg:baucher[ultimo-1].valido})
      }
      else res.status(200).json({estadoimg:false,acceptimg:baucher[ultimo-1].valido});
    }
    else res.status(200).json({estadoimg:false,acceptimg:false}) 
  } catch (error) {
    res.status(500).json({error});
  }  
}

const getDriverStarts = async (req,res)=>{
  try {
    const id = req.params.driverId;
    const driverstart = await DriverStart.findOne({"driverId":id})
    const rating = driverstart.sumatoria/driverstart.total;
    if(!driverstart) return res.status(404).json({ok:false,msg:"no se enocntro"});
    else return res.status(200).json({ok:true,rating:rating||0})
  } catch (error) {
    res.status(500).json({error});
  }
}

module.exports = {  
//  getPrice,
  updateStatus,
  getCoordinates,
  documentStatus,
  accountActivate,
  getAllTrips,
  getBaucheStatus,
  getDriverStarts
}

