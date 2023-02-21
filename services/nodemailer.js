'use strict'
const nodemailer = require("nodemailer");
const config_mail = require('../config/mail');
const ejs = require("ejs");
const path =require("path");

// funcion aux

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
 
const smtpTransport = nodemailer.createTransport({
    host:'smtp.zoho.com',
    port:465,
    secure:true,
    auth: {
      user: config_mail.user,
      pass: config_mail.pass
    }
});

const resetpass = async (userMail,token,activate)=>{
    
    let subject ='CODIGO DE CAMBIO DE CONTRASEÑA';
    let thtml='Hemos recibido una solicitud para restablecer tu contraseña de Evans. ';
    let mensajeFooter='Si no solicitó esto, ignore este correo electrónico y su contraseña permanecerá sin cambios.'
    const html = await ejs.renderFile(path.join(__dirname,"email.ejs"),{ token:token,thtml:thtml,mensajeFooter:mensajeFooter });

    const mailOptions = {
        to: userMail,
        from: `EVANS SOPORTE<${config_mail.user}>`,
        subject:subject,
        html:html
    };
    smtpTransport.sendMail(mailOptions, function(err) {
        if(err) console.log(err)
        console.log('mail sent');
    });
}

const verificarcuenta = async (userMail,token,activate)=>{
    let subject ='CODIGO DE ACTIVACION DE CUENTA'
    let thtml='Hemos recibido una solicitud para activar tu cuenta de Evans. '
    let mensajeFooter=''
    const html = await ejs.renderFile(path.join(__dirname,"email.ejs"),{ token:token,thtml:thtml,mensajeFooter:mensajeFooter});

    const mailOptions = {
        to: userMail,
        from: `EVANS SOPORTE<${config_mail.user}>`,
        subject:subject,
        html:html
    };
    smtpTransport.sendMail(mailOptions, function(err) {
        if(err) console.log(err)
        console.log('mail sent');
    });
}

module.exports = {
    resetpass,
    makeid,
    verificarcuenta
};