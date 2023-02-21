'use static'

const DriverStart = require('../models/driversstars');
const ComentarViaje = require('../models/tripsComents');
const TavelStory = require('../models/travelStory');
const User = require('../models/userModel');
const Car = require('../models/carModel');
const Trip = require('../models/tripsModel');
const TripStatus = require('../models/tripStatus');
const moment = require('moment');


const comentarViajeDriver = async(req,res)=>{
    try {
      const id = req.params.driverId;
      const rating = Number(req.body.rating);
      const mensaje = req.body.mensaje;
      const valoracion = await DriverStart.findOne({driverId:id});
      if(valoracion){
        const comentario = new ComentarViaje({
          driverId:id,
          comentario:mensaje||"null",
          estrella:rating,
          userId:req.body.userId,
          name:req.body.nombre
        });
        if(rating >= 0 && rating <=1){
          valoracion.one = valoracion.one+1;
          valoracion.sumatoria=valoracion.sumatoria+rating;
          valoracion.total=valoracion.total+1;
          await valoracion.save();
          await comentario.save();
          return res.status(200).json({ok:true,msg:"puntaje dado"});
        }
        if(rating > 1 && rating <=2){
          valoracion.two = valoracion.two+1;
          valoracion.sumatoria=valoracion.sumatoria+rating;
          valoracion.total=valoracion.total+1;
          await valoracion.save();
          await comentario.save();
          return res.status(200).json({ok:true,msg:"puntaje dado"});
        }
        if(rating > 2 && rating <=3){
          valoracion.three = valoracion.three+1;
          valoracion.sumatoria=valoracion.sumatoria+rating;
          valoracion.total=valoracion.total+1;
          await valoracion.save();
          await comentario.save();
          return res.status(200).json({ok:true,msg:"puntaje dado"});
        }
        if(rating > 3 && rating <=4){
          valoracion.four = valoracion.four+1;
          valoracion.sumatoria=valoracion.sumatoria+rating;
          valoracion.total=valoracion.total+1;
          await valoracion.save();
          await comentario.save();
          return res.status(200).json({ok:true,msg:"puntaje dado"});
        }
        if(rating > 4 && rating <=5){
          valoracion.five = valoracion.five+1;
          valoracion.sumatoria=valoracion.sumatoria+rating;
          valoracion.total=valoracion.total+1;
          await valoracion.save();
          await comentario.save();
          return res.status(200).json({ok:true,msg:"puntaje dado"});
        }
        else {
          return res.status(200).json({ok:false,msg:"rating debe ser num entre 0 y 5"});
        }
        
      }
      // ComentarViaje
      else res.status(404).json({ok:true,msg:"no se encontro"})
      
    } catch (error) {
      res.status(500).json({ok:false,error})
    }
  }

const listAllTravel = async(req,res)=>{
  try {
    let desde = req.query.desde || 0;
    desde = Number(desde)
    const userId = req.params.userId;
    const travelStory = await TavelStory.find({user:userId},{user:0})      
      .populate('trip','startAddress destinationAddress dateTrip',Trip)
      .populate('tripStatus','tripCancell tripAccepted tripInitiated tripFinalized',TripStatus)
      .skip(desde).limit(15).sort({_id:-1});
    const contar = await TavelStory.countDocuments();



    let arreglo = new Array;

    travelStory.forEach(e => {
      arreglo.push({
        id:e._id,
        startAddress:e.trip.startAddress,
        destinationAddress:e.trip.destinationAddress,
        dateTrip:moment(e.trip.dateTrip).format("DD/MM/YYYY hh:mm a"),
        tripCancell:e.tripStatus.tripCancell,
        tripAccepted:e.tripStatus.tripAccepted,
        tripInitiated:e.tripStatus.tripInitiated,
        tripFinalized:e.tripStatus.tripFinalized,
      });
    });
    res.json({datos:arreglo,total:contar});

  } catch (error) {
    res.status(500).json({error})
  }
}

const getOneTravelStory = async(req,res)=>{
  try {
    const travelId = req.params.travelId;
    const travelStory = await TavelStory.findOne({_id:travelId})
      .populate('driver','name surname',User)
      .populate('car','brandCar modelCar licenseCar',Car)
      .populate('trip','travelRateDiscount travelRate startAddress destinationAddress dateTrip latitudeOrigen longitudeOrigen latitudeDestino longitudeDestino',Trip)
      .populate('tripStatus','tripCancell tripAccepted tripInitiated tripFinalized',TripStatus)
      ;
    const data = {
      driver:travelStory.driver.name+' '+travelStory.driver.surname,
      brandCar:travelStory.car.brandCar,
      modelCar:travelStory.car.modelCar,
      licenseCar:travelStory.car.licenseCar,
      travelRateDiscount:travelStory.trip.travelRateDiscount,
      travelRate:travelStory.trip.travelRate,
      latitudeOrigen:travelStory.trip.latitudeOrigen,
      longitudeOrigen:travelStory.trip.longitudeOrigen,
      latitudeDestino:travelStory.trip.latitudeDestino,
      startAddress:travelStory.trip.startAddress,
      longitudeDestino:travelStory.trip.longitudeDestino,
      destinationAddress:travelStory.trip.destinationAddress,
      dateTrip:moment(travelStory.trip.dateTrip).format("DD/MM/YYYY hh:mm a"),
      tripCancell:travelStory.tripStatus.tripCancell,
      tripAccepted:travelStory.tripStatus.tripAccepted,
      tripInitiated:travelStory.tripStatus.tripInitiated,
      tripFinalized:travelStory.tripStatus.tripFinalized,
    }
    

    res.json({data})
  } catch (error) {
    res.status(500).json({error})
  }
}

module.exports = {
    comentarViajeDriver,
    listAllTravel,
    getOneTravelStory
}

