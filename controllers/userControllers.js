"use static"

const User = require("../models/userModel");
const randomstring = require("randomstring");
const UserImgProfile = require("../models/userProfileImageModel");
const CarModel = require("../models/carModel");
const db = require("../services/firebase").db;

const bcrypt = require("bcryptjs");
const service = require("../services/JWTService");

const Coordinates = require("../models/coordinatesUser");
const DriverStart = require("../models/driversstars");
const resetpass = require("../services/nodemailer").resetpass;
const verificarcuenta = require("../services/nodemailer").verificarcuenta;
const makeid = require("../services/nodemailer").makeid;
const UserToken = require("../models/userToken");

const DriverDocuments = require("../models/driverDocuments");
const DriverMensualidad = require("../models/driverMonthlyPayment");

const CarDoc = require("../models/carDocumentsModel");

const ValidateNewEmail = require("../models/ValideNewEmail");
const Ewallet = require("../models/ewallet");




const UserCoupon = require("../models/userCouponModel");

//Método para verificar si existe o no el Usuario
async function checkIfEmailExists(req,res){
  try {
    const emailSearch = await User.findOne({email: req.body.email, codeDealership: req.body.codeDealership})
    if(!emailSearch){
      res.status(200).json({ emailexist: false, mensaje: "El usuario no existe" });
    }else{
      res.status(200).json({ emailexist: true, mensaje: "El email ya está en uso" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

//Método de Registro de Usuario
async function signUpUser(req, res){
  const email = req.body.email
  const codeDealership = req.body.codeDealership

  if (req.body.password !== req.body.passwordconfirm) {
    res.status(400).json({ success: false, msg: 'Passwords do not match.' });
    return;
  }
  const userSearch = await User.findOne({email: email, codeDealership: codeDealership})

  if (userSearch) {
    res.status(401).json({ success: false, msg: "El email ya esta en uso" });
  }else{

    let name = req.body.name
    let partCode = name.substr(0,3)
    let codeEvansGenerate = partCode + randomstring.generate(7)

    const user = new User({
      codeEvans: codeEvansGenerate.toLowerCase(),
      codeDealership: req.body.codeDealership,
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      cellphone: req.body.cellphone,
      city: req.body.city,
      password: req.body.password
    });
  
    user.password = await user.encryptPassword(req.body.password)
  
    user.save(async function(err, user){
      if(err) {
        res.status(500).send({success: false, msg: `Error al registrarte: ${err}`})

        /*if (err.errors) {
          if (err.errors.name) {
            res.status(400).json({ success: false, msg: err.errors.name.message });
            return;
          }
          if (err.errors.surname) {
            res.status(400).json({ success: false, msg: err.errors.surname.message });
            return;
          }
          if (err.errors.email) {
            res.status(400).json({ success: false, msg: err.errors.email.message });
            return;
          }
          if (err.errors.phone) {
            res.status(400).json({ success: false, msg: err.errors.phone.message });
            return;
          }
          if (err.errors.cellphone) {
            res.status(400).json({ success: false, msg: err.errors.cellphone.message });
            return;
          }
          if (err.errors.dni) {
            res.status(400).json({ success: false, msg: err.errors.dni.message });
            return;
          }
          if (err.errors.password) {
            res.status(400).json({ success: false, msg: err.errors.password.message });
            return;
          }
          res.status(500).send({success: false, msg: `Error al registrarte: ${err}`})
        }*/

      }else {
        const userId = user._id; //Recuperamos el id del usuario a registrar
        
        const userImgProfile = new UserImgProfile({
          userId: userId,
        });

        const carInformation = new CarModel({
          userId: userId
        })
        
        await userImgProfile.save() //Creamos el usuario
        await carInformation.save() //Creamos la coleccion de información del auto por defecto
        
        const topicFirebase = `settingDriver/${codeDealership}/${userId}` //path para almacenar datos del FirebaseDB
        
        let carInformationFirebase = {
          carCode: "none",
          carActivation: "none",
          carBrand: "null",
          carModel: "null",
          yearOfProduction: "null",
          carColor: "null",
          carRegistration: "null"
        }

        let imgProfileFirebase = {
          imageActivation: "none",
          profileImage: "null",
          imageUpdate: false
        }
        
        const information = {
          accountActivate: false,
          carInformationFirebase,
          imgProfileFirebase
        }
        
        const ref = db.ref(topicFirebase)
        ref.update(information) //Guardamos la información en Firebase DB realtime

        res.status(200).json({success: true, msg: 'Te has registrado correctamente'})
        
      }
  
    });

  }

}

//Método para inicio de sesión de Cliente
async function signInUser(req, res) {
  const codeDealership = req.body.codeDealership
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  await User.findOne({ email: email, codeDealership: codeDealership }, function (error, user) {
    if (error) {
      res.status(500).json({ message: `Error al realizar la petición: ${err}` });
    }
    if (!user) {
      res.status(404).json({ message: "El usuario no existe" });
    } else {
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          res.status(500).json({ message: `Error al realizar la petición: ${err}` });
        }
        if (!isMatch) {
          res.status(400).json({ message: `Contraseña incorrecta`});
        } else {
          const token = service.createToken(user);
          const topic = `settingDriver/${codeDealership}/${user._id}`;
          console.log(topic);
          const infomation = {
            accountActivate: user.activatedAsDriver
          };
          const ref = db.ref(topic);
          console.log(ref);
          ref.update(infomation);

          return res.status(200).json({
            success: true,
            user: {
              id: user._id,
              token: "bearer " + token,
              message: "Te has logueado correctamente",
            },
          });

        }
      });
    }
  });
}

//Método para enviar información Personal por ID
async function getInformationUser(req, res) {
  let userId = req.params.userId;
  try {
    const user = await User.findById(userId, (err) => {
      if (err){
        return res.status(500).json({ message: `Error al realizar la petición: ${err}` });
      }
    });
    if (!user){
      return res.status(404).json({ message: "El usuario no existe" });
    }else{
      res.status(200).json({
        user: {
          codeEvans: user.codeEvans,
          codeDealership: user.codeDealership,
          isReferred: user.isReferred,
          accountActivate: user.accountActivate,
          name: user.name,
          surname: user.surname,
          email: user.email,
          cellphone: user.cellphone,
          city: user.city,
          informationUpdate: user.informationUpdate
        },
      });
      /*const userimg = await UserImgProfile.findOne({ userCreator: userId },(err) => {
          if (err){
            return res.status(500).json({ message: `Error al realizar la petición: ${err}` });
          }
        }
      );
      if (!userimg)
        return res.status(404).json({ message: "La imagen del usuario no existe no existe" });
      else {
        const url = req.originalUrl.split("/")[2];
        if (url === "driver") user.accountActivate = user.isDriver;
        res.status(200).json({
          user: {
            codeEvans: user.codeEvans,
            codeDealership: user.codeDealership,
            isReferred: user.isReferred,
            accountActivate: user.accountActivate,
            name: user.name,
            surname: user.surname,
            email: user.email,
            cellphone: user.cellphone,
            city: user.city,
            informationUpdate: user.informationUpdate
          },
        });
      }*/
    } 
  } catch (error) {
    res.status(500).json({ error });
  }
}

//Método de Registro de Cliente
/*async function signUp(req, res) {
  const email = req.body.email.toLowerCase();
  if (req.body.password !== req.body.passwordconfirm) {
    res.status(400).json({ success: false, msg: "Passwords do not match." });
    return;
  }
  const userSearch = await User.findOne(
    { email: email },
    { accountActivate: 1 }
  );
  if (userSearch) {
    if (userSearch.accountActivate)
      res
        .status(401)
        .json({ success: false, msg: "El email ya esta en uso true" });
    else
      res
        .status(401)
        .json({ success: false, msg: "El email ya esta en uso false" });
  } else {
    // const statusCoupon = await StatusCoupon.find()
    const user = new User({
      name: req.body.name,
      surname: req.body.surname,
      numDocument: req.body.numDocument,
      email: email,
      cellphone: req.body.cellphone,
      city: req.body.city,
      password: req.body.password,
    });

    user.password = await user.encryptPassword(req.body.password);
    user.save(async function (err, user) {
      if (err) {
        if (err.errors) {
          if (err.errors.name) {
            res
              .status(402)
              .json({ success: false, msg: err.errors.name.message });
            return;
          }
          if (err.errors.surname) {
            res
              .status(403)
              .json({ success: false, msg: err.errors.surname.message });
            return;
          }
          if (err.errors.email) {
            res
              .status(404)
              .json({ success: false, msg: err.errors.email.message });
            return;
          }
          if (err.errors.cellphone) {
            res
              .status(405)
              .json({ success: false, msg: err.errors.cellphone.message });
            return;
          }
          if (err.errors.numDocument) {
            res
              .status(406)
              .json({ success: false, msg: err.errors.numDocument.message });
            return;
          }
          if (err.errors.password) {
            res
              .status(407)
              .json({ success: false, msg: err.errors.password.message });
            return;
          }
          res
            .status(500)
            .json({ success: false, msg: `Error al registrarte: ${err}` });
        }
      } else {
        const userId = user._id;
        const coordinates = new Coordinates({
          userCreator: userId,
          latitude: "null",
          longitude: "null",
        });
        const userImgProfile = new UserImgProfile({
          userCreator: userId,
        });
        const userToken = new UserToken({
          userCreator: userId,
        });
        const driverDocuments = new DriverDocuments({
          driverId: userId,
        });
        const driverMensualidad = new DriverMensualidad({
          driverId: userId,
        });
        const cardriver = new CarMoldel({
          driverId: userId,
        });
        const docCard = new CarDoc({
          carId: cardriver._id,
        });
        const driverstart = new DriverStart({
          driverId: userId,
        });
        const ewallet = new Ewallet({
          user: userId,
        });

        await ewallet.save();
        await userToken.save();
        await userImgProfile.save();
        await coordinates.save();
        await driverDocuments.save();
        await driverMensualidad.save();
        await cardriver.save();
        await docCard.save();
        await driverstart.save();

        const topic = `settingDriver/${userId}`;
        let photosCar = {
          policeRecord: "false",
          criminalRecod: "false",
          driverLicence: "false",
          soatFront: "false",
          tarjetaPropFront: "false",
          tarjetaPropReverse: "false",
        };
        const infomacion = {
          accountActivate: false,
          photosCar,
        };
        const ref = db.ref(topic);
        ref.update(infomacion);
        res.status(200).json({
          success: true,
          user: userId,
          msg: "Te has registrado correctamente",
        });
      }
    });
  }
}

//Método para inicio de sesión de Cliente
async function signIn(req, res) {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  await User.findOne({ email: email }, function (error, user) {
    if (error) {
      res
        .status(500)
        .json({ message: `Error al realizar la petición: ${err}` });
    }
    if (!user) {
      res.status(404).json({ message: "El usuario no existe" });
    } else {
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
          res
            .status(500)
            .json({ message: `error al realizar la petición: ${err}` });
        }
        if (!isMatch) {
          res.status(400).json({ message: `Email o contraseña incorrectos` });
        } else {
          const token = service.createToken(user);
          const topic = `settingDriver/${user._id}`;
          console.log(topic);
          const infomacion = {
            accountActivate: user.isDriver,
          };
          const ref = db.ref(topic);
          console.log(ref);
          ref.update(infomacion);

          return res.status(200).json({
            success: true,
            user: {
              id: user._id,
              token: "bearer " + token,
              message: "Te has logueado correctamente",
            },
          });
        }
      });
    }
  });
}

//Método para enviar información Personal por ID
async function getInformation(req, res) {
  let userId = req.params.userId;

  try {
    const user = await User.findById(userId, (err) => {
      if (err)
        return res
          .status(500)
          .json({ message: `Error al realizar la petición: ${err}` });
    });
    if (!user) return res.status(404).json({ message: "El user no existe" });
    const userimg = await UserImgProfile.findOne(
      { userCreator: userId },
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ message: `Error al realizar la petición: ${err}` });
      }
    );
    if (!userimg)
      return res.status(404).json({ message: "El img user no existe" });
    else {
      const url = req.originalUrl.split("/")[2];
      if (url === "driver") user.accountActivate = user.isDriver;
      res.status(200).json({
        user: {
          codeEvans: user.codeEvans,
          isReferred: user.isReferred,
          imageProfile: userimg.imgPerfil,
          accountActivate: user.accountActivate,
          name: user.name,
          surname: user.surname,
          numDocument: user.numDocument,
          email: user.email,
          cellphone: user.cellphone,
          city: user.city,
          imgUpdate: userimg.imgUpdate,
          imgActivation: userimg.imgActivation,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
}

//Método para enviar información de los cupones por ID
async function getCoupones(req, res) {
  let userId = req.params.userId;

  await UserCoupon.find({ userId }, (err, userCoupon) => {
    if (err) {
      res
        .status(500)
        .json({ message: `Error al realizar la petición: ${err}` });
    }
    if (!userCoupon) {
      res.status(404).json({ message: "El conductor no existe" });
    } else {
      res.status(200).json(userCoupon);
    }
  });
}

//Método para actualizar tokens de acceso y firebase
async function updateValues(req, res) {
  try {
    const userCreator = req.params.userId;
    const { fcmToken } = req.body;

    const urlName = req.originalUrl.split("/")[2];
    const userToken = await UserToken.findOne({ userCreator });

    if (urlName === "user") {
      userToken.fcmCustomer = fcmToken;
      await userToken.save();
      return res.status(200).json(userToken);
    }
    if (urlName === "driver") {
      userToken.fcmDriver = fcmToken;
      await userToken.save();
      return res.status(200).json(userToken);
    } else return res.status(404).json("vacio");
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function updateCoordinates(req, res) {
  const userId = req.params.userId;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  await Coordinates.findOneAndUpdate(
    { userCreator: userId },
    { latitude: latitude, longitude: longitude },
    function (err, coordinatesUser) {
      if (err) {
        res.status(500).json({ message: `Error al realizar la petición: ` });
      }
      if (!coordinatesUser) {
        res
          .status(404)
          .json({ message: `No existe las coordenadas del conductor` });
      } else {
        res
          .status(200)
          .json({ message: `Se actualizo las coordenadas correctamente` });
      }
    }
  );
}

// Cambiar contraseña
const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const tokencode = makeid(5);
    const user = await User.findOne({ email: email });
    if (!user)
      res
        .status(404)
        .json({ ok: false, msg: "No account with that email address exists." });
    else {
      const userToken = await UserToken.findOne({ userCreator: user._id });
      userToken.codeRestPass = tokencode;
      userToken.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await userToken.save();
      resetpass(email, tokencode);
      res.status(200).json({ ok: true, user: user._id });
    }
  } catch (error) {
    res.status(500).json({ ok: false });
  }
};

const confirmToken = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.body.token;
    const userToken = await UserToken.findOne({
      userCreator: id,
      codeRestPass: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!userToken)
      return res.status(404).json({
        ok: false,
        darMensaje: "Reset token is invalid or has expired.",
      });
    else {
      const user = await User.findById(id);
      user.resetPass = true;
      userToken.codeRestPass = undefined;
      userToken.resetPasswordExpires = undefined;
      await user.save();
      await userToken.save();
      res.status(200).json({ ok: true });
    }
  } catch (error) {
    res.status(500).json({ ok: false });
  }
};

const validateResetPass = async (req, res) => {
  try {
    const id = req.params.id;
    const password = req.body.password;
    const user = await User.findById(id);
    bcrypt.compare(password, user.password, async function (err, isMatch) {
      if (err) {
        return res
          .status(500)
          .json({ message: `error al realizar la petición: ${err}` });
      }
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: `Email o contraseña incorrectos` });
      } else {
        user.resetPass = true;
        await user.save();
        return res.status(200).json({ ok: true });
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false });
  }
};

const changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user)
      res.status(404).json({
        ok: false,
        msg: "Password reset token is invalid or has expired.",
      });
    if (!user.resetPass) user.resetPass = false;
    if (user.resetPass === true) {
      user.password = await user.encryptPassword(req.body.password);
      user.resetPass = false;
    } else
      return res.status(404).json({
        ok: false,
        msg: "Password reset token is invalid or has expired.",
      });
    await user.save();
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//Valdiar email de los usuarios
const mensajevalidate = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const tokencode = makeid(5);
    const user = await User.findOne({ email: email, accountActivate: false });
    if (!user)
      res
        .status(404)
        .json({ ok: false, msg: "No account with that email address exists." });
    else {
      const userToken = await UserToken.findOne({ userCreator: user._id });
      userToken.codeRestPass = tokencode;
      userToken.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await userToken.save();
      verificarcuenta(email, tokencode);
      res.status(200).json({ ok: true, user: user._id });
    }
  } catch (error) {
    res.status(500).json({ ok: false });
  }
};

const confirmtokenValidate = async (req, res) => {
  try {
    const id = req.body.id;
    const token = req.body.token;
    const userToken = await UserToken.findOne({
      userCreator: id,
      codeRestPass: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!userToken)
      return res.status(404).json({
        ok: false,
        darMensaje: "Reset token is invalid or has expired.",
      });
    else {
      const user = await User.findById(id);
      user.accountActivate = true;
      userToken.codeRestPass = undefined;
      userToken.resetPasswordExpires = undefined;
      await user.save();
      await userToken.save();
      res.status(200).json({ ok: true, user });
    }
  } catch (error) {
    res.status(500).json({ ok: false });
  }
};

const sendEmailToValidate = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const userSearch = await User.findOne({ email });
    if (userSearch)
      return res
        .status(200)
        .json({ emailexist: true, mensaje: "Email existe" });
    const user = await ValidateNewEmail.findOne({ email });
    const tokencode = makeid(5);
    if (!user) {
      const newUser = new ValidateNewEmail({
        email: email,
        code: tokencode,
        exp: Date.now() + 3600000,
      });
      await newUser.save();
    } else {
      user.code = tokencode;
      user.exp = Date.now() + 3600000; // 1 hour
      await user.save();
    }
    verificarcuenta(email, tokencode);
    return res
      .status(200)
      .json({ emailexist: false, mensaje: "Se envio un mensaje a su correo" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const confirmNewEmail = async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const tokencode = req.body.code;
    const userToken = await ValidateNewEmail.findOne({
      email,
      code: tokencode,
      exp: { $gt: Date.now() },
    });
    if (!userToken) return res.status(200).json({ esValido: false });
    else {
      res.status(200).json({ esValido: true });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};*/

module.exports = {
  checkIfEmailExists,
  signUpUser,
  signInUser,
  getInformationUser,
  /*
  updateValues,
  updateCoordinates,
  forgotPassword,
  confirmToken,
  changePassword,
  mensajevalidate, //validar email
  confirmtokenValidate, //validar email
  validateResetPass,
  sendEmailToValidate,
  confirmNewEmail,
  getCoupones,*/
};
