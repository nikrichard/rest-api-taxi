'use strict'
const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config/db');

//Función para crear el JWT
function createToken(user){
	const payload = {
		sub: user._id,
		role: user.role,
		iat: moment().unix(),
		exp: moment().add(150, 'days').unix(),
	}
	return jwt.encode(payload,config.SECRET_TOKEN)
}

//Función para decodificar el JWT
function decodeToken(token){
	const decoded = new Promise((resolve,reject)=>{
		try{
			const payload = jwt.decode(token,config.SECRET_TOKEN)
			if (payload.exp <= moment().unix()) {
				reject({
					status: 401,
					message: 'Access token has expired'
				})
			}
			resolve(payload)
		}catch (err){
			reject({
				status: 500,
				message : 'Invalid access token'
			})
		}
	})
	return decoded
}

module.exports = {
	createToken,
	decodeToken
}