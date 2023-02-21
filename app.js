'use strict'
const express = require('express')
const app = express();
const morgan=require("morgan")

const routesUser = require('./routes/userRoutes')
const routesDealership = require('./routes/dealershipRoutes')
const routesAdmin = require('./routes/adminRoutes')
const routesPriceTrip = require('./routes/priceTripRoutes')

//const routesDriver = require('./routes/driver')
const routesCar = require('./routes/carRoutes')
const routesNotifications = require('./routes/notifications')
const admin = require('./routes/adminRoutes')
const imgupdate = require('./routes/img')
const other = require('./routes/others')
const routeDriverNotification=require('./routes/DriverNotification');
const customer=require('./routes/customer');

const repository = require('./routes/repository')

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(morgan("dev"))


app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use('/api', routesUser)
app.use('/api/admin', routesDealership)
app.use('/api', routesAdmin)
app.use('/api', routesPriceTrip)

/*app.use('/api/admin', admin)
app.use('/api/driver', routesDriver)
app.use('/api/car', routesCar)
app.use('/api/notifications', routesNotifications)
app.use('/api/upload', imgupdate)
app.use('/api/other', other)
app.use('/api/user', customer)//customers
app.use('/api', routeDriverNotification)
app.use('/api', repository)*/



	
module.exports = app 