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

const adminSchema = new Schema({
    codeDealership: {
        type: String, 
        required: true
    },
    name: {
      type: String,
      required: [true, 'Name is required.']
      //validate: nameValidator
    },
    surname: {
      type: String,
      required: [true, 'Surname is required.']
      //validate: surnameValidator
    },
    numDocument: {
      type: String,
      required: [true, 'Document is required.']
      //validate: dniValidator
    },
    email: {
      type: String,
      required: [true, 'Email is required.']
      //unique: true,
      //validate: emailValidator
    },
    cellphone: {
      type: String,
      required: [true, 'Cellphone is required.']
      //validate: cellphoneValidator
    },    
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    accountActivate: {
      type: Boolean,
      default: false
    },
    signupDate: {
      type: Date, 
      default: Date.now()
    },
    role: {
        type: String,
        enum: ["admin", "dealership"],
        required: true
    },
    lastLogin : {
      type: Date
    }
})

adminSchema.methods.encryptPassword = async function(password){
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (e) {
      return e;
    }
}

module.exports = mongoose.model('Admin', adminSchema)