'use strict'

const ServiceGoogle = require('../services/googleMapsApi.js');

let distanciaKilometros = 0;
let priceKilometer = 0;
let price = 0;

let aux = 0
let resultElevation = 0;
let valorApropiado = 0;

//Función para redondear un número
function round(num, decimales = 1) {
    var signo = (num >= 0 ? 1 : -1);
    num = num * signo;
    if (decimales === 0) //con 0 decimales
        return signo * Math.round(num);
    // round(x * 10 ^ decimales)
    num = num.toString().split('e');
    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
    // x * 10 ^ (-decimales)
    num = num.toString().split('e');
    return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
}

//Función para calcular el precio según el código de empresa
async function calculatePriceTrip(codeDealsership, originLatitude, originLongitude, destinationLatitude, destinationLongitude){

	let originAltitude = await ServiceGoogle.elevation(originLatitude,originLongitude)
						.then((body)=>{
							let result = JSON.parse(body);
							return Math.round(result.results[0].elevation); 
						}).catch((message)=>{
							return message;	
						})

	let destinationAltitude = await ServiceGoogle.elevation(destinationLatitude,destinationLongitude)
						.then((body)=>{
							let result = JSON.parse(body);
							return Math.round(result.results[0].elevation); 
						}).catch((message)=>{
							return message;	
						})

	//Aqui obtenemos la distancia de dos puntos en metros
	//Si queremos la distancia en Kilometros debemos de cambiar "value" por "text"
	let distanciaOrigenDestino = await ServiceGoogle.distanceMatrix(originLatitude, originLongitude, destinationLatitude, destinationLongitude)
								.then((body)=>{
									let result = JSON.parse(body);
									return result.rows[0].elements[0].distance.value
								}).catch((message)=>{
									return message
								})
	
	distanciaKilometros = distanciaOrigenDestino / 1000;

	if(codeDealsership == "e00001"){
		let priceTrip = await e00001PriceTrip(distanciaKilometros, priceKilometer, price) //Precio por defecto de la aplicación demo
		return priceTrip
	}else if(codeDealsership == "e00002"){
		let priceTrip = await e00002PriceTrip(distanciaKilometros, priceKilometer, price)
		return priceTrip
	}
	
}

/************************************************************
******Funciones por código de empresa (codeDealsership)******
************************************************************/
//Función para la empresa con el código "e00001"
function e00001PriceTrip(distanciaKilometros, priceKilometer, price){
	if(distanciaKilometros <= 10){
		if(distanciaKilometros <= 2){
			//cualquier numero acepta por que saldra 4 soles si o si
			priceKilometer = 1
		}else{
			priceKilometer = 2.25	
		} 
	}else{
		priceKilometer = 1.35
	}
	
	let basicPrice = priceKilometer * distanciaKilometros
	if( basicPrice <= 4 ){
		price = 4
	}else{
		price = basicPrice
	}

	price = round(price);
	let priceTripService = price.toFixed(2);
	//let priceTripService1 = (price + 1.00).toFixed(2);
	
	let priceTrip = {
		priceTrip : priceTripService
	}
	return priceTrip;
}

//Función para la empresa con el código "e00002"
function e00002PriceTrip(distanciaKilometros, priceKilometer, price){
	if(distanciaKilometros <= 10){ ////modificar a partir de 8 kilometros
		if(distanciaKilometros <= 2){
			//cualquier numero acepta por que saldra 4 soles si o si
			priceKilometer = 1
		}else{
			priceKilometer = 2.25	
		} 
	}else{
		priceKilometer = 1.35
	}
	
	let basicPrice = priceKilometer * distanciaKilometros
	if( basicPrice <= 4 ){
		price = 4
	}else{
		price = basicPrice
	}

	price = round(price);
	let priceTripService = price.toFixed(2);
	//let priceTripService1 = (price + 1.00).toFixed(2);
	
	let priceTrip = {
		priceTrip : priceTripService
	}
	return priceTrip;
}

//Función para la empresa con el código "e00003"
function e00003PriceTrip(distanciaKilometros, priceKilometer, price){
	if(distanciaKilometros <= 10){
		if(distanciaKilometros <= 2){
			//cualquier numero acepta por que saldra 4 soles si o si
			priceKilometer = 1
		}else{
			priceKilometer = 2.25	
		} 
	}else{
		priceKilometer = 1.35
	}
	
	let basicPrice = priceKilometer * distanciaKilometros
	if( basicPrice <= 4 ){
		price = 4
	}else{
		price = basicPrice
	}

	price = round(price);
	let priceTripService = price.toFixed(2);
	//let priceTripService1 = (price + 1.00).toFixed(2);
	
	let priceTrip = {
		priceTrip : priceTripService
	}
	return priceTrip;
}

//Función para la empresa con el código "e00004"
function e00004PriceTrip(distanciaKilometros, priceKilometer, price){
	if(distanciaKilometros <= 10){
		if(distanciaKilometros <= 2){
			//cualquier numero acepta por que saldra 4 soles si o si
			priceKilometer = 1
		}else{
			priceKilometer = 2.25	
		} 
	}else{
		priceKilometer = 1.35
	}
	
	let basicPrice = priceKilometer * distanciaKilometros
	if( basicPrice <= 4 ){
		price = 4
	}else{
		price = basicPrice
	}

	price = round(price);
	let priceTripService = price.toFixed(2);
	//let priceTripService1 = (price + 1.00).toFixed(2);
	
	let priceTrip = {
		priceTrip : priceTripService
	}
	return priceTrip;
}


module.exports = {
	calculatePriceTrip
}


////////////////////////////////////CALCULO DE PRECIOS Puno V 2.0//////////////////////////////////
	/*let priceKilometer=0;
	let aux=0
	let resultElevation = 0;
	let distanciaKilometros = distanciaOrigenDestino / 1000;
	let valorApropiado = 0;

	//recalcula la distancia segun la altura
		if (distanciaKilometros < 1) {
				aux=1;
		}else{
				aux=distanciaKilometros;
			}
		if (destinationAltitude > originAltitude) 
			resultElevation = destinationAltitude - originAltitude;

		valorApropiado = 37 - ( (resultElevation / aux) / 10 );

		let newDistanceKm = ((((resultElevation / (aux)) * valorApropiado  ) + (distanciaOrigenDestino))/1000) ;
	
	//calcula el costo "x" kilometro para la nueva distancia recalculada
		if(newDistanceKm<=2){
			priceKilometer=2.1	
		}
		if(newDistanceKm>=10) {
			priceKilometer=1
		}
		if(newDistanceKm>2&&newDistanceKm<10){
			priceKilometer =(2.4/((newDistanceKm*newDistanceKm)-((newDistanceKm*newDistanceKm)/3)))+1.1428
		}

	//calcula la el precio basico  con el costo "x" kilometro la nueva distancia
		let basicPrice=priceKilometer*newDistanceKm

		if( basicPrice <= 3.50 ){
			price = 3.50
		}else{
			price = basicPrice
		}

	price = round(price);

	let ecoEvans = price.toFixed(2);
	//let evansCarga = (price + 1.00).toFixed(2);
	//let evansEvolution = (price + 0.50).toFixed(2);
	//let evansRevolution = (price + 1.00).toFixed(2);
	
	////////////////////////////////////////////////////////////////////////////////////////////
	let priceApp = {
		ecoEvans : ecoEvans
		//evansCarga: evansCarga,
		//evansEvolution: evansEvolution,
		//evansRevolution: evansRevolution
	}

	return priceApp;*/