'use static'
const Admin = require('../models/adminModel')
const User = require('../models/userModel')
const Dealership = require('../models/dealershipModel')
const Car = require('../models/carModel')
const ProfileImage = require('../models/userProfileImageModel')

const bcrypt = require('bcryptjs')
const service = require('../services/JWTService') //Token JWT
const db = require("../services/firebase").db;

//Método de Registro del administrador
async function signUpAdmin(req, res){
  let email = req.body.email
  if (req.body.password !== req.body.passwordconfirm) {
    res.status(400).json({ success: false, message: 'Las contraseñas no coinciden.'})
  }
  const adminSearch = await Admin.findOne({email: email})
  if (adminSearch) {
    res.status(401).json({ success: false, message: "El email ya esta en uso" })
  }else{
    const admin = new Admin({
      codeDealership: req.body.codeDealership,
      name: req.body.name,
      surname: req.body.surname,
      numDocument: req.body.numDocument,
      email: req.body.email,
      cellphone: req.body.cellphone,
      password: req.body.password,
      role: req.body.role
    });
    admin.password = await admin.encryptPassword(req.body.password, (error)=>{
      res.status(500).send({success: false, message: `Error al encriptar la contraseña: ${error}`})
    })
    await admin.save((error) => {
      if(error) {
        res.status(500).send({success: false, message: `Error al registrar administrador: ${err}`})
      }else {
        res.status(200).json({success: true, message: 'Se registró correctamente la cuenta'});
      }
    });
  }//Fin de la condicional else
}

//Método para inicio de sesión del cliente
async function signInAdmin(req, res){
  const email = req.body.email
  const password = req.body.password
  try {
    const admin = await Admin.findOne({email: email}, (error)=>{
      if(error){
        res.status(500).json({success: false, message: `Error al buscar usuario: ${error}`})
      }
    })
    if(!admin){
      res.status(404).json({success: false, message: 'El usuario no existe'})
    }else{
      await bcrypt.compare(password, admin.password, async function(error, isMatch){
        if (error) {
          res.status(400).json({success: false, message: `Error al comparar las contraseñas: ${error}`})
        }if (!isMatch) {
          res.status(200).json({success: false, message: `Contraseña incorrecta`})
        }else{
          const token = await service.createToken(admin)
          return res.status(200).json({
            success: true,
            admin: {
              id: admin._id,
              token: "bearer " + token,
              message: 'Te has logueado correctamente'
            }
          })
        }
      })
    }//Fin de la condicional else
  } catch (error) {
    res.status(500).json({success: false, message: `Error: ${err}`})
  }
}

//Método para enviar información Personal por ID
async function getInformationAdmin(req,res){
  let adminId = req.params.adminId
  try {
    const admin = await Admin.findById(adminId, (err)=>{
      if (err) {
        res.status(500).json({message: `Error al realizar la petición: ${err}`})
      }
    })
    if (!admin) {
      res.status(404).send({message: 'El usuario no existe'})
    }else{
      res.status(200).json({
        admin: {
          adminId: admin._id,
          accountActivate: admin.accountActivate,
          codeDealership: admin.codeDealership,
          name: admin.name,
          surname: admin.surname,
          numDocument: admin.numDocument,
          email: admin.email,
          cellphone: admin.cellphone,
          role: admin.role
        }
      });
    }
  } catch (error) {
    res.status(500).json({success: false, message: `Error: ${err}`})
  }
}

//Método enviar los administradores de las empresas
function getAdminsOfDealerships(req,res){
  res.send('administradores de las empresas')
}

//Método para ver informacion del administrador de cada empresa
function getInfoAdminDealership(req,res){
  res.send('informacion del administrador')
}

//Método actualizar el administrador de una empresa
function updateAdminDealership(req,res){
  res.send('administradores de las empresas')
}

//Método para eliminar el administrador de una empresa
function deleteAdminDealership(req,res){
  res.send('informacion del administrador')
}

/*********************************************
 * Métodos del administrador de una empresa *
*********************************************/

//Método para ver los usuarios registrador por código de empresa
async function getUsersByDealershipCode(req,res){
  const codeDealership = req.params.codeDealership
  let desde = req.query.desde || 0;
  try{
    const usersOfDealership = await User.find({codeDealership: codeDealership, accountActivate: true},
        {
            accountActivate: 1,
            codeEvans: 1,
            name: 1,
            surname: 1,
            city: 1,
        }
    )
    .skip(parseInt(desde))
    .limit(10)
    .sort({ _id: -1 }); //-1 para descendente y 1 para ascendente
    return res.status(200).json({status: true, usersOfDealership, total: usersOfDealership.length})
  }catch(err){
      return res.status(500).json({err});
  }
}

//Método para ver los usuarios registrador que se suscribieron como conductores
async function getUsersByDealershipCode(req,res){
  const codeDealership = req.params.codeDealership
  let desde = req.query.desde || 0;
  try{
    const countUsers = await User.find({accountActivate: true, codeDealership: codeDealership}, (error)=>{
      if(error){
        res.status(500).json({ status: false, message: `Error al realizar la consulta: ${error}`});  
      }
    })
    if(!countUsers){
      res.status(404).json({ status: false, message: "No existen usuarios registrados" });
    }else{
      const usersOfDealership = await User.find({accountActivate: true, activatedAsDriver: false, codeDealership: codeDealership},
        {
          accountActivate: 1,
          codeEvans: 1,
          name: 1,
          surname: 1,
          city: 1,   
        }
      )
      .skip(parseInt(desde))
      .limit(10)
      .sort({ _id: -1 }); //-1 para descendente y 1 para ascendente
      return res.status(200).json({status: true, usersOfDealership, total: countUsers.length})//countUsers});*/
    }
  }catch(err){
      return res.status(500).json({err});
  }
}

//Método para ver la información del conductor segun el código de empresa
async function getInfoUserByDealershipCode(req,res){
  const codeDealership = req.params.codeDealership;
  const codeUser = req.query.codeUser;
  try {
      const user = await User.findOne({codeEvans: codeUser, codeDealership: codeDealership})
      if(!user){
          res.status(404).json({ status: false, message: "El usuario no existe" });
      }else{
          res.status(200).json({ status: true, user: user});
      }
  } catch (error) {
      return res.status(500).json({ error });
  }
}

//Función para buscar el usuario por código que se le brinda y por codigo de empresa
async function searchUserByUserCode(req,res){
  const codeDealership = req.params.codeDealership
  const codeUser = req.query.codeUser.toLowerCase()
  try {
    const user = await User.findOne({codeEvans: codeUser, codeDealership: codeDealership},(error)=>{
      if(error){
        res.status(500).json({ status: false, message: `Error al realizar la consulta: ${error}`});  
      }
    });
    if(!user){
      res.status(404).json({ status: false, message: "El usuario no existe" });
    }else{
      res.status(200).json({ status: true, 
        user: {
          accountActivate: user.accountActivate,
          codeEvans: user.codeEvans,
          name: user.name,
          surname: user.surname,
          city: user.city,
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error });
  } 
}

//Función para activar y desactivar cuenta como conductor
async function activateAccountAsDriver(req,res){
  const codeDealership = req.params.codeDealership
  const userId = req.params.userId
  const activatedAsDriver = req.body.activatedAsDriver
  const activateAccountAsDriver = {
      activatedAsDriver: activatedAsDriver,
  }
  const activateAccountAsDriverFirebase = {
      accountActivate: activatedAsDriver,
  }
  try {
      const user = await User.findOne({_id: userId, codeDealership: codeDealership}, (error)=>{
          if(error){
              res.status(500).json({
                  success: false, 
                  message: `Error al realizar la busqueda del usuario`
              })    
          }
      })
      if(!user){
          res.status(404).json({
              success: true, 
              message: `El usuario no existe`
          })
      }else{
          const user = await User.findByIdAndUpdate(userId, activateAccountAsDriver, {new:true})
          if(!user){
              return res.status(404).json({
                status: false, 
                message: "El usuario no existe" 
              });
          }else{
              const topic = `settingDriver/${codeDealership}/${userId}`;
              const ref = db.ref(topic);
              ref.update(activateAccountAsDriverFirebase);
              return res.status(200).json({
                  success: true, 
                  message: "Se realizó correctamente el cambio" 
              });
          }
      }
  } catch (error) {
      res.status(500).json({
          success: false, 
          message: `Error: ${error}`
      })
  }
}

//Método para ver los usuarios habilitados como conductores
async function getUsersEnabledAsDrivers(req,res){
  const codeDealership = req.params.codeDealership
  let desde = req.query.desde || 0;
  try{
    const countUsers = await User.find({accountActivate: true, activatedAsDriver: true, codeDealership: codeDealership}, (error)=>{
      if(error){
        res.status(500).json({ status: false, message: `Error al realizar la consulta: ${error}`});  
      }
    })
    if(!countUsers){
      res.status(404).json({ status: false, message: "No existen usuarios habilitados como conductores" });
    }else{
      const usersOfDealership = await User.find({accountActivate: true, activatedAsDriver: true, codeDealership: codeDealership},
        {
          accountActivate: 1,
          codeEvans: 1,
          name: 1,
          surname: 1,
          city: 1,   
        }
      )
      .skip(parseInt(desde))
      .limit(10)
      .sort({ _id: -1 }); //-1 para descendente y 1 para ascendente
      return res.status(200).json({status: true, usersOfDealership, total: countUsers.length})//countUsers});*/
    }
  }catch(err){
      return res.status(500).json({err});
  }
}

/*async function deleteUserByDealership(req,res){
  const codeDealership = req.params.codeDealership
  const userId = req.body.userId
  try {
      const dealership = await Dealership.findOne({codeDealership: codeDealership},(error)=>{
        if(error){
          res.status(500).json({success: false, message: `Error al realizar la consulta: ${error}`});  
        }
      })
      if(!dealership){
        res.status(404).json({
          success: true, 
          message: `No existe la concesionaria`
        })
      }else{
        await User.findOneAndRemove({_id: userId})
        await Car.findOneAndRemove({userId: userId})
        await ProfileImage.findOneAndRemove({userId: userId})


      }
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: `Error: ${error}`
  })
  }
}*/

module.exports = {
	signUpAdmin,
  signInAdmin,
  getInformationAdmin,

  getAdminsOfDealerships, //Modulos por implementar
  getInfoAdminDealership, //************************** */
  updateAdminDealership, //************************** */
  deleteAdminDealership, //************************** */

  getUsersByDealershipCode,
  getInfoUserByDealershipCode,
  searchUserByUserCode,
  activateAccountAsDriver,
  getUsersEnabledAsDrivers
}