'use strict'

const Driver = require('../models/userModel')
const Car = require('../models/carModel')
const DriverImg = require('../models/userProfileImageModel')

async function getInformationDriver(req,res){
	const driverId = req.params.driverId

	try {
		const driver = await Driver.findById(driverId)
		const car = await Car.findOne({driverId: driverId})
		const driverImg = await DriverImg.findOne({userCreator: driverId})

		res.status(200).json({
			information:{
				driverImg: driverImg.imgPerfil,
				name: driver.name,
				surname: driver.surname,
				licenseCar: car.licenseCar,
				brandCar: car.brandCar,
				modelCar: car.modelCar,
				colorCar: car.colorCar
			}
		})
	} catch (e) {
		res.status(404).json({message: `Error: ${e}`})
	}

}

module.exports = {
	getInformationDriver
}