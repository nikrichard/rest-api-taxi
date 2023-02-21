'use strict'

const express = require('express')
const router = express.Router();
const cors = require('cors')
const auth = require('../middlewares/auth')

const profile = require('../controllers/uploadImg')

// router.put('/upload/img/driver/document/:id', cors(), profile.upLoadDriverDocuments)
router.put('/img/driver/document/policeRecordCert/:id', cors(), profile.upLoadDriverDocuments)
router.put('/img/driver/document/criminalRecodCert/:id', cors(), profile.upLoadDriverDocuments)
router.put('/img/driver/document/driverLicense/:id', cors(), profile.upLoadDriverDocuments)
router.put('/img/driver/car/SOAT/:id', cors(), profile.upLoadCarDocuments)
router.put('/img/driver/car/propertyCardForward/:id', cors(), profile.upLoadCarDocuments)
router.put('/img/driver/car/propertyCardBack/:id', cors(), profile.upLoadCarDocuments)
router.put('/img/:type?/:id', cors(), profile.profileUserDriver)
router.put('/img/driver/pago/:id', cors(), profile.baucherDriver)

module.exports = router