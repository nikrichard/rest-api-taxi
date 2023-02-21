'use strict'

const express = require('express')
const router = express.Router();
const cors = require('cors')
const auth = require('../middlewares/auth')
const version = require('../models/version-model')

const other = require('../controllers/driverControllers')

const coupon = require('../controllers/cuponesControl')

router.get('/driver/active/:driverId', cors(), other.accountActivate)



router.post('/registerCoupon',cors(),coupon.registarCupon)
router.post('/userGetCoupon',cors(),coupon.userGetCoupon)


module.exports = router
