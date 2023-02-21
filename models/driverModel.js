'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validate = require('mongoose-validator');
const bcrypt = require('bcryptjs')

const nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Name must not exceed {ARGS[1]} characters.'
  })
];

const surnameValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Surname must not exceed {ARGS[1]} characters.'
  })
];

const emailValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Email must not exceed {ARGS[1]} characters.'
  }),
  validate({
    validator: 'isEmail',
    message: 'Email must be valid.'
  })
];

const dniValidator = [
  validate({
    validator: 'isLength',
    arguments: [8, 8],
    message: 'el numero de DNI tiene que ser de {ARGS[0]} digitos.'
  }),
  validate({
    validator: 'matches',
    arguments: /^[0-9][0-9]+$/,
    message: 'en este campo solo se admiten numeros del 0 al 9.'
  })
];

const phoneValidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 6],
    message: 'el numero de telefono tiene que ser de {ARGS[0]} digitos.'
  }),
  validate({
    validator: 'matches',
    arguments: /^[0-9][0-9]+$/,
    message: 'en este campo solo se admiten numeros del 0 al 9.'
  })
];

const cellphoneValidator = [
  validate({
    validator: 'isLength',
    arguments: [9, 9],
    message: 'el numero de celular tiene que ser de {ARGS[0]} digitos.'
  }),
  validate({
    validator: 'matches',
    arguments: /^[0-9][0-9]+$/,
    message: 'en este campo solo se admiten numeros del 0 al 9.'
  })
];

const passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 20],
    message: 'Password must be between {ARGS[0]} and {ARGS[1]} characters.'
  })
];

const driverSchema = new Schema({
  codeEvans: {type: String, default: 'null'},
  name: {
    type: String,
    required: [true, 'Name is required.'],
    validate: nameValidator
  },
  surname: {
    type: String,
    required: [true, 'Surname is required.'],
    validate: surnameValidator
  },
  numDocument: {
    type: String,
    required: [true, 'Document is required.'],
    validate: dniValidator
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    validate: emailValidator
  },
  cellphone: {
    type: String,
    required: [true, 'Cellphone is required.'],
    validate: cellphoneValidator
  },

  city: String,
  
  password: {
    type: String,
    required: [true, 'Password is required.'],
    //validate: passwordValidator
  },
  driverTokens: {
    accessToken: {
      type: String,
      default: 'null'
    },
    fcmToken: {
      type: String,
      default: 'null'
    }
  },
  
  accountActivate: {
    type: Boolean, 
    default: false
  },
  statusSwitch:{ //Estado del switch
    type: Boolean, 
    default: false
  },
  serviceStatus:{ //Estado del servicio
    type: Boolean, 
    default: true
  },
  informationUpdate:{
    type: Boolean,
    default: false
  },
  signupDate: {
    type: Date, default: Date.now()
  },
  
  lastLogin : Date,
  role: {
    type: String,
    default: "driver"
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  codeRestPass: String
});

driverSchema.methods.encryptPassword = async function(password){
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (e) {
    res.status(500).send({success: false, message: `Error al registrarte: ${err}`})
  }
}

module.exports = mongoose.model('Driver', driverSchema);