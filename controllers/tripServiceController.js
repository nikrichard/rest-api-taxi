'use static'

const Trip = require('../models/tripsModel')
const TripStatus = require('../models/tripStatus')

const perdirDrivers = async(req,res)=>{
    try {
      const userId = req.params.userId;
      const latitudeOrigen = req.body.latitudeOrigen;
      const longitudeOrigen = req.body.longitudeOrigen;
      const latitudeDestino = req.body.latitudeDestino;
      const longitudeDestino = req.body.longitudeDestino;
      const city = req.body.city;
      const startAddress = req.body.startAddress;
      const destinationAddress = req.body.destinationAddress;
      const travelRate = req.body.travelRate;
      const travelRateDiscount = req.body.travelRateDiscount;
      const trip = new Trip({
        user:userId,
        city,
        startAddress,
        destinationAddress,
        dateTrip: Date.now(),
        travelRate
      })
      const tripStatus = new TripStatus({
        tripId:trip._id
      })
      res.json({trip,tripStatus})
    } catch (error) {
      res.status(500).json({ok:false})
    }
  }

module.exports = {
	perdirDrivers
}

