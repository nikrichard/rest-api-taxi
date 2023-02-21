module.exports = {
	port: process.env.PORT || 3000, //coneccion al puerto localhost:3000 y coneccion al servidor de la nube
	db: process.env.MONGODB || ////Base de datos en mongoAtlas
		'mongodb+srv://evans:ECorp2019@evans-yda4b.mongodb.net/evans?retryWrites=true&w=majority',
	//db: process.env.MONGODB || 'mongodb://localhost:27017/evansPrueva',  //coneccion local a mongo db	
	SECRET_TOKEN: 'mysecrettokensrestapiv1', 	//toque secret para el generador de jwt 
}
