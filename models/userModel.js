'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

//const validate = require('mongoose-validator');

/*const nameValidator = [
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
];*/

const userSchema = new Schema({
  codeEvans: {
    type: String, 
    required: true
  },
  codeDealership: {
    type: String,
    required: [true, 'CodeDealership is required.']
  },
  name: {
    type: String,
    required: [true, 'Name is required.'],
    //validate: nameValidator
  },
  surname: {
    type: String,
    required: [true, 'Surname is required.'],
    //validate: surnameValidator
  },
  email: {
    type: String,
    required: [true, 'Email is required.']
    //validate: emailValidator
  },
  cellphone: {
    type: String,
    required: [true, 'Cellphone is required.'],
    //validate: cellphoneValidator
  },
  city: {
    type: String,
    required: [true, 'City is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
  },
  accountActivate: {
    type: Boolean, 
    default: true
  },
  activatedAsDriver: {
    type: Boolean,
    default: false
  },
  signupDate: {
    type: Date, 
    default: Date.now()
  },
  informationUpdate:{
    type: Boolean,
    default: false
  },
  isReferred: { 
    type: Boolean, 
    default:false
  },
  lastLogin : {
    type: Date
  },

});

userSchema.methods.encryptPassword = async function(password){
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (e) {
    res.status(500).send({success: false, message: `Error al registrarte: ${err}`})
  }
}

module.exports = mongoose.model('User', userSchema);
