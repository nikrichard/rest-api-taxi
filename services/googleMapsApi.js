'use strict'

const request = require('request');

//Función para traer la información en JSON ingresando coordenadas de latitude y longitude
function reverseGeocoding(latitude, longitude){

	let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key=AIzaSyBE-Ew1PqSOVZAD6ZlFe0u_XpVbfkajsd0";

	return new Promise(function(resolve, reject){
		request(url, function(error, response, body){
			if(response.statusCode != 200){
				reject(error)
			}else{
				resolve(body)
			}
		});
	})

}

//Función para calcular la distancia entre dos puntos
function distanceMatrix(originLatitude, originLongitude, destinationLatitude, destinationLongitude){

	let url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+originLatitude+","+originLongitude+"&destinations="+destinationLatitude+","+destinationLongitude+"&key=AIzaSyBE-Ew1PqSOVZAD6ZlFe0u_XpVbfkajsd0";
	
	return new Promise(function(resolve, reject){
		request(url, function(error, response, body){
			if(response.statusCode != 200){
				reject(error)
			}else{
				resolve(body)
			}
		});	
	})

}

//Funcion para traer la elevación de un punto segun las coordenadas de latitude y longitude
function elevation(latitude, longitude){

	let url = "https://maps.googleapis.com/maps/api/elevation/json?locations="+latitude+","+longitude+"&key=AIzaSyBE-Ew1PqSOVZAD6ZlFe0u_XpVbfkajsd0";

	return new Promise(function(resolve, reject){
		request(url, function(error, response, body){
			if(response.statusCode != 200){
				reject(error)
			}else{
				resolve(body)
			}
		});
	});

}

module.exports = {
	distanceMatrix,
	elevation,
	reverseGeocoding
};