'use strict'

var fcm = require('fcm-notification');
const TripInfo=require('../models/TripInfoModels')
const Driver = require('../models/userModel');
const User = require('../models/userModel');
const coordinatesDriver = require('../models/coordinatesUser')
const coordinatesUser = require('../models/coordinatesUser')
const Viaje = require('../models/tripsModel')
const TripStatus = require('../models/tripStatus')
const DriverMonthlyPayment = require('../models/driverMonthlyPayment')
const Coupon=require('../models/coupon')
const DriverCoupon = require('../models/driverCouponModel')
//HECHO JUANCHO 19-02-2020
const userCoupon = require('../models/userCoupon');
const userToken = require('../models/userToken')
const TravelStory = require('../models/travelStory');
const Car = require('../models/carModel');
const Ewallet = require('../models/ewallet');
//FIN
const moment = require('moment');
moment.locale("es");
const FCM = new fcm('./evansuser-93e07-firebase-adminsdk-fdncq-45c6ef2caf.json')

//HECHO POR: JUANCHO 19-02-2020
async function CalcNewPriceWithCupon(req,res){
    const UserId = req.params.userId;
    const Price=req.body.Price;
    try {
        let Coupones=await userCoupon.find({userId:UserId,isUsed:false}).populate({
            path: 'couponId',
            model:Coupon,
            match: {expireuser: { $gte: Date.now()} || null}
        })
        let Coupones2=[];
        let j=0;
        Coupones.forEach((val)=>{
            if(val.couponId!=null){
                Coupones2[j]=val
                j++
            }
        });
        if(Coupones2.length===0){
            return res.status(200).json({ok:true,CashPrice:Price.toFixed(2)});
        }else{
            let resid=Price;
            let i=0;
            while(resid>=0){
                if(Coupones2[i]){
                    resid=resid-Coupones2[i].value;
                    i++;
                }else{
                    break;
                }
            }
            if(resid<=0){
                return res.status(200).json({ok:true,CashPrice:"0.00"});
            }else{
                return res.status(200).json({ok:true,CashPrice:parseFloat(resid).toFixed(2)});
            }
        }

    } catch (err) {
        return res.status(500).json({ok:false,err})
    }
}

//FIN
// calcule price with Ewallet
async function CalcNewPriceWithEwallet(req,res){    
    try {
        const UserId = req.params.userId;
        const Price=Number(req.body.Price) || 0;
        const ewallet = await Ewallet.findOne({user:UserId});

        let newprice = Price - ewallet.value
        if(newprice < 0) return res.status(200).json({ok:true,CashPrice:parseFloat(0.00).toFixed(2)});
        return res.status(200).json({ok:true,CashPrice:parseFloat(newprice).toFixed(2)});
    } catch (err) {
        return res.status(500).json({ok:false,err})
    }
}

async function radio(valor){
    let aux = await valor * Math.PI/180;    
    return aux 
}

async function compCoordinates(lat1,lon1,lat2,lon2){

      var radioTierra = 6378.137; //radioio de la tierra en km
      var dLat = await radio( lat2 - lat1 );
      var dLong = await radio( lon2 - lon1 );
      //console.log(lat1)
      var a = await Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos( await radio(lat1)) * Math.cos(await radio(lat2)) * Math.sin(dLong/2) * Math.sin(dLong/2);
      var c = await 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var distancia = await radioTierra * c;

      return distancia

}

//Función para enviar el pedido de viaje a todos los conductores
async function notificationAllDriver(req,res){
        
    let userId = req.params.userId
    let latitudeOrigen = req.body.latitudeOrigen
    let longitudeOrigen = req.body.longitudeOrigen
    let latitudeDestino = req.body.latitudeDestino
    let longitudeDestino = req.body.longitudeDestino
    let city = req.body.city
    let startAddress = req.body.startAddress
    let destinationAddress = req.body.destinationAddress
    let dateTrip = req.body.dateTrip
    let travelRate = req.body.travelRate
    let travelRateDiscount = req.body.travelRateDiscount

    await Driver.find({statusSwitch:true}, async function(err, drivers){//isDriver?
        if (err) {
            res.status(500).json({message: `Error al realizar la petición: ${err}`})
        }if (!drivers) {
            res.status(404).json({message: 'El conductor no existe'})
        }else{
            var tokensFCM = [];
            //busca el balor del cupon
            for (var i = 0; i < drivers.length; i++) {
                await coordinatesDriver.findOne({userCreator: drivers[i]._id}, async function(err, driversCoordinates){
                    
                    let distancia = await compCoordinates(driversCoordinates.latitude,driversCoordinates.longitude, latitudeOrigen , longitudeOrigen )
                    if(distancia < 2){                        
                        //almacena token firebase de conductor en tokensFCM                            
                        await userToken.findOne({userCreator: driversCoordinates.userCreator}, async function(err, driversTokens){
                            await tokensFCM.push(driversTokens.fcmDriver)
                        })                                            
                    }
                })
            }
            const viaje = new Viaje({
                user: userId,
                driver: 'null',
                city: city,
                startAddress: startAddress,
                destinationAddress: destinationAddress,
                dateTrip: dateTrip,
                travelRate: travelRate,
                travelRateDiscount:travelRateDiscount,
                latitudeOrigen: req.body.latitudeOrigen,
                longitudeOrigen: req.body.longitudeOrigen,
                latitudeDestino: req.body.latitudeDestino,
                longitudeDestino: req.body.longitudeDestino
            })

            try{
                const viajeCreate = await viaje.save()
                const tripStatus = new TripStatus({
                    tripId: viajeCreate._id                 
                })

                await tripStatus.save()
                // res 
            }catch(e){
                res.status(500).json({message: `Error al guardar viaje: ${e}`})
            }

            var message = {
                data:{
                    userId: String(userId),
                    viajeId: String(viaje._id),
                    startAddress: startAddress,
                    destinationAddress: destinationAddress,
                    latitudeOrigen: latitudeOrigen,
                    longitudeOrigen: longitudeOrigen,
                    latitudeDestino: latitudeDestino,
                    longitudeDestino: longitudeDestino,
                    travelRate: String(travelRate),
                    travelRateDiscount:String(travelRateDiscount),
                    response: 'requestDriver',
                    title : 'Solicitud-de-viaje',
                    body : 'Alguien-esta-solicitando-servicio'
                },
            };
            
            const timeoutObj = await setTimeout(async () => {
                //console.log(tokensFCM)
                if(tokensFCM != ''){
                    await FCM.sendToMultipleToken(message, tokensFCM, function(err, response){
                        if(err){
                            res.status(500).json({message: `Error al enviar mensaje: ${err}`})
                        }
                        else{
                            //console.log(message) //viiajeid
                            res.status(200).json({success: true, message: `se mando satisfactoriamente el mensaje a todos: $`,viajeId:viaje._id})
                        }
                    })
                }
                else{
                    res.status(404).json({success: false, message: `no se encontraron movilidades serca `})
                }
            }, 1500);

        //}
        //else{    
           // res.status(500).json({message: `No existen token:${err}`})

        //}
  
        }
    })

}


//Función para aceptar la notificacion de viaje de un cliente
async function aceptedNotification(req, res){
    
    let driverId = req.params.driverId
    let tripId = req.body.tripId
    try {
        const trip = await Viaje.findById(tripId);
        if (!trip) return res.status(404).json({message: 'el viaje no existe'});
        if(trip.driver === "null"){
            const tripstatus = await TripStatus.findOne({tripId:tripId});
            if (!tripstatus) return res.status(404).json({message: 'el viaje no existe'});
            if(tripstatus.tripAccepted === true) res.status(404).json({success: false,message: 'lo sentimos el viaje fue tomado'});
            if(tripstatus.tripCancell === true) res.status(404).json({success: false,message: 'lo sentimos el viaje fue cancelado'});
            if(tripstatus.tripAccepted === false) {
                trip.driver=driverId;
                await trip.save();
                // historial de trips
                const carid = await Car.findOne({driverId:driverId},{_id:1});
                const tripStatusId = await TripStatus.findOne({tripId:trip._id},{_id:1});
                const travelStory = new TravelStory({
                    user: trip.user,
                    driver: driverId,
                    car: carid._id,
                    trip: trip._id,
                    tripStatus: tripStatusId._id
                });
                await travelStory.save();
                res.status(200).json({success: true, message: 'servicio acceptado'});        
            }
        }
        else{
            res.status(400).json({success: true, message: 'el viaje ya fue tomado'});
        }    
        
    } catch (error) {
        return res.status(500).json({message: `Error al realizar la petición: ${error}`});
    }
}

//Función para enviar una notificacion o mensaje a un conductor
async function sendUsernotifications(req, res){
    let userId = req.params.userId
    let driverId = req.body.driverId
    let price = req.body.price
    let pricediscount = req.body.pricediscount
    let response = req.body.response   

    
    await userToken.findOne({userCreator:driverId}, async function(err, driver){
        if (err) {
            res.status(500).json({message: `Error al realizar la petición: ${err}`})
        }if (!driver) {
            res.status(404).json({message: 'el viaje no existe'})
        }else{
            
            var token = driver.fcmDriver
            
            //var token = 'fzWVysxJRFA:APA91bEknYXJplsHuTEuBNWweDDx8cYu0aYZ5TRqvXVSCC_FYO7nhT4VenMHjSP1HeWHm3srLnJQU1kZWcJ6v8EmY55Rxysr-dzg84Hw7g5Vwt1NWToHzSQ0kExm1iDLdIwkyINaNZ9a';
            //console.log(token)
            var message = {
                data:{
                    userId: String(userId), 
                    response: String(response),
                    price : String(price),
                    pricediscount : String(pricediscount)
                },                
                token : token
            };
        
            await FCM.send(message, function(err) {
                if(err){
                    res.status(500).json({success: false,message: `Error al enviar mensaje: ${err}`})
                }else {
                    res.status(200).json({success: true,message: 'se mando el mensaje correctamente'})
                }
            })
        }

    })    
}

//Función para enviar una notificación o mensaje a un cliente(usuario)
async function sendDrivernotifications(req, res){
    let driverId = req.params.driverId
    let userId = req.body.userId
    let title = req.body.title
    let message1 = req.body.message 
    let response = req.body.response
    let chatId = req.body.chatId 
    let tripid = req.body.tripId

    const trip = await Viaje.findOne({_id:tripid});
    if(trip.driver === driverId){
    
        await userToken.findOne({userCreator:userId}, async function(err, user){
            if (err) {
            res.status(500).json({message: `Error al realizar la petición: ${err}`})
            }if (!user) {
            res.status(404).json({message: 'el viaje no existe'})
            }else{
                
                var token = user.fcmCustomer
                console.log(token,'token')
                
                // var token = 'coipY3Dhf-8:APA91bF3ZDpxgNUcLCZFy1l2UrX6eJm_oipgnRTirgTZP54ZDW13vjogvKmeCqXJJFml86tirLuod_siKtyOac5hXCyz-4cC-KAlfhvHvR39KVZTkQY7uQwGCD5M5dEeWBo9VoIT-ukx';
                //console.log(token)
                var message = {
                    data: {
                        driverId: String(driverId),
                        response : String(response),
                        chatId: String(chatId),
                        title : String(title),
                        body : String(message1)
                    },                
                    token:token
                    };
                await FCM.send(message, function(err) {
                    if(err){
                        res.status(500).json({success: false,message: `Error al enviar mensaje: ${err}`})
                    }else {
                        res.status(200).json({success: true,message: 'se mando el mensaje correctamente'})
                    }
                })
            }

        })

    }
    else {
        res.status(404).json({success: false,message: 'driver no exite en este trip'})
    }
}


//Función para actualizar los estados que tiene la coleccion del viaje


const CalculateCupon=(Cupones,value)=>{
    let resid=value;
    let i=0;
    let arr=[];
    while(resid>=0){
        if(Cupones[i]){
            resid=resid-Cupones[i].value;
            if(resid>0){
                arr[i]={where:{_id:Cupones[i]._id},update:{isUsed:true,value:0.00}};
            }else{
                arr[i]={where:{_id:Cupones[i]._id},update:{isUsed:false,value:((-1)*resid).toFixed(2)}};
            }
            i++;
        }else{
            break;
        }
    }
    return arr;
}

const PaymentTrip=async (TripId)=>{
    console.log(TripId)
    try {
        let RespTrip=await Viaje.findOne({_id:TripId})
        let travelRateDiscount=RespTrip.travelRateDiscount
        
        let status=500
        let ok=false
        if(travelRateDiscount>0){
            let Coupones=await userCoupon.find({userId:RespTrip.user,isUsed:false}).populate({
                path: 'couponId',
                model:Coupon,
                match: {expireuser: { $gte: Date.now()} || null}
            })            
            //Limpiando los nulos
            let sum=0;
            let j=0;
            let Coupones2=[];
            Coupones.forEach(vl=>{
                if(vl.couponId!=null){
                    sum+=vl.value
                    Coupones2[j]=vl;
                    j++;
                }
            });
            //Fin limpiar Nulos
            if(Coupones2.length==0){status=500;ok=false;}
            if(Coupones2.length>0){
                console.log(Coupones2)
                if(sum>=travelRateDiscount){
                    let DriverMontly =await DriverMonthlyPayment.findOne({driverId:RespTrip.driver});
                    if(DriverMontly&&RespTrip){
                        let update=CalculateCupon(Coupones2,travelRateDiscount)
                        update.forEach(async (val)=>{
                            await userCoupon.updateMany(val.where,val.update);
                        })
                        await DriverMonthlyPayment.updateOne({_id:DriverMontly._id},{value:(DriverMontly.value-travelRateDiscount).toFixed(2)})
                        status=200
                        ok=true
                    }
                }else{
                    status=500
                    ok=false
                }
            }
        }else{
            status=200
            ok=true
        }
        return {status:status,ok:ok};
    } catch (err) {
        return {status:500,ok:false};
    }
}
async function UpdatePaymentAmount(req,res){
    const TripId=req.params.TripId;
    const {travelRate,travelRateDiscount}=req.body;
    try {
        await Viaje.updateOne({_id:TripId},{travelRate:travelRate,travelRateDiscount:travelRateDiscount})
        return res.status(200).json({success: true,message: `Correcto`}) 
    } catch (err) {
        return res.status(500).json({success: false,message: `Error al realizar la petición: ${err}`}) 
    }
}
const auxStatusTrip = (cancel=false,accepted=false,initiated=false,finished=false)=>{
    console.log("holas auxStatusTrip")
    return {
        tripCancell:cancel,
        tripAccepted:accepted,
        tripInitiated:initiated,
        tripFinalized:finished
    }
}
async function statusTrip(req, res){
    let tripId = req.params.tripId
    let body = req.body
    let update = auxStatusTrip(body.tripCancell,body.tripAccepted,body.tripInitiated,body.tripFinalized);

    try {
        const tripstatus = await TripStatus.findOne({tripId:tripId})
        if(!tripstatus) return res.status(404).json({success: false,message: 'el viaje no existe'})
        tripstatus.overwrite({ 
            tripCancell: update.tripCancell,
            tripAccepted: update.tripAccepted,
            tripInitiated: update.tripInitiated,
            tripFinalized: update.tripFinalized,
            tripId:tripId
        });
        //MOdificado
        await tripstatus.save();
        console.log(update.tripCancell,"tripCancell")
        console.log(update.tripFinalized,"tripFinalized")
        if(tripstatus.tripCancell==true){
            console.log(tripId,"antes de terminar")
            let resp=await PaymentTrip(tripId)
            return res.status(resp.status).json({ok:resp.ok})
        }else if(tripstatus.tripFinalized==true){
            console.log(tripId,"antes de finalizar")
            let resp=await PaymentTrip(tripId)
            return res.status(resp.status).json({ok:resp.ok})
        }else{
            return res.status(200).json({ok:true})
        }
        //modificado
    } catch (error) {
        return res.status(500).json({success: false,message: `Error al realizar la petición: ${error}`})       
    }
}

const getStatusTrip = async (req,res)=>{
    let tripId = req.params.tripId
    try {
        console.log("getStatusTrip");
        let  tripstatus = await TripStatus.findOne({tripId})
        if(!tripstatus) return res.status(404).json({ok:false,message:"No se encontro un viaje"});
        if(tripstatus.tripCancell === true || tripstatus.tripAccepted === false || tripstatus.tripFinalized === true){
            return res.status(200).json({ok:false,tripstatus})
        }else{
            return res.status(200).json({ok:true,tripstatus})
        } 
    } catch (error) {
        return res.status(500).json({ok:false,error})
    }
}

async function deleteTrip(req, res){
    console.log("deleteTrip")
    let tripId = req.params.tripId
    
    try{
        await TripStatus.findOneAndRemove({tripId: tripId})
        await Viaje.findByIdAndRemove(tripId)
        res.status(200).json({message: 'El viaje se a borrado satisfactoriamente'})
    }catch(e){
        res.status(500).json({message:`Error :${e}`})
    }

}

async function ListCouponsUser(req,res){
    let userId=req.params.userId
    try {
        await userCoupon.find({userId:userId}).populate({
            path:'couponId',
            model:Coupon,

            select:'value name expire expireuser'
        }).exec((err,CouponUser)=>{
            if(err) return res.status(500).json({ok: false, message: `Ocurrio un error ${err}`})
            if(CouponUser.length===0) res.status(404).json({ok: false, message: `Usted no cuenta con  Cupones`})
            if(CouponUser.length>0){
                CouponUser.forEach((val,i)=>{
                    CouponUser[i]={isUsed:(val.isUsed===true?'SI':'NO'),
                                   name:(val.couponId===null?null:val.couponId.name),
                                   value:(val.couponId===null?0.00:(val.couponId.value).toFixed(2)),
                                   saldo:(val.value.toFixed(2)),
                                   expire:(val.couponId.expireuser < Date.now()?'Venció '+moment(val.couponId.expireuser).fromNow():'Vence '+moment(val.couponId.expireuser).fromNow())
                                  }
                    if(val.couponId.expireuser===null&&val.isUsed==true) CouponUser[i].expire= 'Nunca vence'; // sorry jaucnho
                });
                return res.status(200).json({ok:true,messageCoupon:CouponUser})
            }
        }); 
    } catch (e) {
        return res.status(500).json({ok: false, message: `Ocurrio un error ${e}`})
    }
}

const returnListTripsUser=Viajes=>{
    let valores=[]
    let ViajeInfo={} 
    return new Promise(async (resolve,reject)=>{
        Viajes.forEach(async (val,i)=>{
            ViajeInfo= await TripInfo.findOne({tripId:val._id});
            if(!ViajeInfo){
                ViajeInfo={
                    HourStart: '00:00:00',
                    HourEnd: '00:00:00',
                    _id: 'NO DEFINIDO',
                    tripId: 'NO DEFINIDO',
                    nameDriver: '-',
                    PlacaCAr: '-',
                    modelCar: '-'
                  }
            }
            valores[i]={city:val.city.toUpperCase(), startAddress:val.startAddress.toUpperCase(), 
                    destinationAddress:val.destinationAddress.toUpperCase(),travelRate:parseFloat(val.travelRate).toFixed(2),
                    travelRateDiscount:parseFloat(val.travelRateDiscount).toFixed(2),
                    tripId:ViajeInfo.tripId,
                    nameDriver:ViajeInfo.nameDriver,
                    PlacaCAr:ViajeInfo.PlacaCAr,
                    modelCar:ViajeInfo.modelCar,
                    HourStart:ViajeInfo.HourStart,
                    HourEnd:ViajeInfo.HourEnd
            };
        })
        setTimeout(_=>{
            resolve(valores);
        },2500)
        
    });
}

async function ListTripsUser(req,res){
    let userId=req.params.userId;
    try {
        let Viajes=await Viaje.find({user:userId,driver:{$ne:null}})
        .select('_id city startAddress destinationAddress travelRate travelRateDiscount dateTrip').sort({dateTrip:-1})
        returnListTripsUser(Viajes).then(val=>{
            res.status(500).json({tama:val.length,Trips:val});
        })
    } catch (error) {
        res.status(500).json({Trips:false});
    }
}
async function TripsMoreInfo(req,res){
    const tripId=req.params.tripId
    const nameDriver =req.body.nameDriver
    const PlacaCAr=req.body.PlacaCAr
    const modelCar=req.body.modelCar
    const HourStart=req.body.HourStart
    const HourEnd =req.body.HourEnd
    try {
        let TripsInfoo=new TripInfo({
            tripId:tripId,
            nameDriver:nameDriver,
            PlacaCAr:PlacaCAr,
            modelCar:modelCar,
            HourStart:HourStart,
            HourEnd:HourEnd
        })
        await TripsInfoo.save();
        res.status(200).json({ok:true});
    } catch (err) {
        res.status(500).json({ok:false});
    }


}
module.exports = {
    notificationAllDriver,
    aceptedNotification,
    sendUsernotifications,
    sendDrivernotifications,
    statusTrip,
    deleteTrip,
    getStatusTrip,
    ListCouponsUser,
    CalcNewPriceWithCupon, //agregado por JUANCHO
    UpdatePaymentAmount,
    ListTripsUser,
    TripsMoreInfo
};