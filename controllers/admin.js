"use static";

// modificar

const userModel = require("../models/userModel");
const userProfile = require("../models/userImgProfile");
const driverModel = require("../models/userModel");
const driverProfile = require("../models/userImgProfile");
const driverDocuments = require("../models/driverDocuments");
const carModel = require("../models/carModel");
const carDocument = require("../models/carDocumentsModel");
const Admin = require("../models/adminModel");
const BaucherDriver = require("../models/driverPayment");
const deletefile = require("../services/file_upload").deletefile;
const service = require("../services");
const bcrypt = require("bcryptjs");
const DriverStarts = require("../models/driversstars");

const db = require("../services/firebase").db;

// variable para firebase
let photosCar = {
  policeRecord: null,
  criminalRecod: null,
  driverLicence: null,
  soatFront: null,
  tarjetaPropFront: null,
  tarjetaPropReverse: null,
};

// ===========================================================================================
// USERS
// ===========================================================================================

const GetAllUsers = async (req, res) => {
  let desde = req.query.desde || 0;
  desde = Number(desde);
  try {
    const users = await userModel
      .find(
        {},
        {
          codeEvans: 1,
          accountActivate: 1,
          signupDate: 1,
          informationUpdate: 1,
          name: 1,
          surname: 1,
          numDocument: 1,
          email: 1,
          cellphone: 1,
          city: 1,
        }
      )
      .skip(desde)
      .limit(10)
      .sort({ _id: -1 });
    const contarusers = await userModel.countDocuments();
    return res.status(200).json({ ok: true, users, total: contarusers });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const uProfile = async (req, res) => {
  let id = req.params.userId;
  try {
    const profile = await userProfile.findOne(
      { userCreator: id },
      { imgPerfil: 1, imgUpdate: 1, imgActivation: 1, userCreator: 1 }
    );
    return res.status(200).json({ ok: true, userimg: profile });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// updates

const updateUserById = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const update = {
    name: body.name,
    surname: body.surname,
    numDocument: body.numDocument,
    email: body.email,
    cellphone: body.cellphone,
    city: body.city,
    isDriver: body.accountActivate, // es driver
    informationUpdate: body.informationUpdate,
    codeEvans: null,
  };
  try {
    const user = await userModel.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(200).json({ ok: false, msg: "no encontrado" });
    return res.status(200).json({ ok: true, user });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// ===========================================================================================
// DRIVERS
// ===========================================================================================
const GetAllDrivers = async (req, res) => {
  let desde = req.query.desde || 0;
  let accountActivate = req.query.accountActivate;
  if (accountActivate === "true") buscar = { accountActivate: true };
  if (accountActivate === "false") buscar = { accountActivate: false };
  desde = Number(desde);
  try {
    const drivers = await driverModel
      .find(
        { isDriver: true },
        {
          codeEvans: 1,
          accountActivate: 1,
          statusSwitch: 1,
          serviceStatus: 1,
          informationUpdate: 1,
          signupDate: 1,
          name: 1,
          surname: 1,
          numDocument: 1,
          email: 1,
          cellphone: 1,
          city: 1,
        }
      )
      .skip(desde)
      .limit(10)
      .sort({ _id: -1 });
    const contardrivers = await driverModel.countDocuments({ isDriver: true });
    return res.status(200).json({ ok: true, total: contardrivers, drivers });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// getdriver

const getdriver = async (req, res) => {
  let dni = req.params.dni;
  try {
    const driver = await driverModel.findOne(
      { numDocument: dni, isDriver: true },
      {
        codeEvans: 1,
        accountActivate: 1,
        statusSwitch: 1,
        serviceStatus: 1,
        informationUpdate: 1,
        signupDate: 1,
        name: 1,
        surname: 1,
        numDocument: 1,
        email: 1,
        cellphone: 1,
        city: 1,
      }
    );
    res.status(200).json({ driver });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const dProfile = async (req, res) => {
  let id = req.params.driverId;
  try {
    const profile = await driverProfile.findOne(
      { userCreator: id },
      { imgPerfil: 1, imgUpdate: 1, imgActivation: 1, userCreator: 1 }
    );
    if (!profile)
      return res.status(404).json({ ok: false, msg: "No encontrado" });
    return res.status(200).json({ ok: true, driverimg: profile });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const dDcocument = async (req, res) => {
  let id = req.params.driverId;
  try {
    const document = await driverDocuments.findOne(
      { driverId: id },
      {
        licence: 1,
        imgUpdate: 1,
        imgActivation: 1,
        criminalRecodCert: 1,
        policeRecordCert: 1,
      }
    );
    if (!document) return res.status(404).json({ ok: false, msg: "Not found" });
    return res.status(200).json({ ok: true, document });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const dDocCar = async (req, res) => {
  let id = req.params.driverId;
  try {
    const car = await carModel.findOne({ driverId: id }, { _id: 1 });
    if (!car)
      return res.status(404).json({ ok: false, msg: "no existe tiene carro" });
    const docar = await carDocument.findOne(
      { carId: car._id },
      {
        soatFront: 1,
        tarjetaPropFront: 1,
        tarjetaPropReverse: 1,
        imgActivation: 1,
      }
    );
    if (!docar)
      return res.status(404).json({ ok: false, msg: "carro sin documentos" });
    res.status(200).json({ docar });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

// updates

const updateDriverById = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    const driver = await driverModel.findById(id);
    if (!driver)
      return res.status(200).json({ ok: false, msg: "no encontrado" });
    driver.accountActivate = body.accountActivate;
    await driver.save();
    const topic = `settingDriver/${driver._id}`;
    const infomacion = {
      accountActivate: driver.accountActivate,
    };
    const ref = db.ref(topic);
    ref.update(infomacion);
    return res.status(200).json({ ok: true, driver });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const uDriverDoc = async (req, res) => {
  const id = req.params.dDocId;
  const body = req.body;
  try {
    const document = await driverDocuments.findById(id);
    const driver = await driverModel.findOne(document.driverId);
    const topic = `settingDriver/${driver._id}`;
    if (body.driverLicence) {
      if (body.driverLicence == "false") {
        if (document.licence !== "null") {
          deletefile(document.licence);
          document.licence = "null";
          document.imgActivation.driverLicence = false;
          driver.accountActivate = false;
          photosCar.driverLicence = "false";
        }
      } else {
        if (document.licence === "null") {
          document.imgActivation.driverLicence = false;
          photosCar.driverLicence = "false";
        } else {
          document.imgActivation.driverLicence = true;
          photosCar.driverLicence = "true";
        }
      }
    }
    if (body.criminalRecod) {
      if (body.criminalRecod === "false") {
        if (document.criminalRecodCert !== "null") {
          deletefile(document.criminalRecodCert);
          document.criminalRecodCert = "null";
          document.imgActivation.criminalRecod = false;
          driver.accountActivate = false;
          photosCar.criminalRecod = "false";
        }
      } else {
        if (document.criminalRecodCert === "null") {
          document.imgActivation.criminalRecod = false;
          photosCar.criminalRecod = "false";
        } else {
          document.imgActivation.criminalRecod = true;
          photosCar.criminalRecod = "true";
        }
      }
    }
    if (body.policeRecord) {
      if (body.policeRecord == "false") {
        if (document.policeRecordCert !== "null") {
          deletefile(document.policeRecordCert);
          document.policeRecordCert = "null";
          document.imgActivation.policeRecord = false;
          driver.accountActivate = false;
          const infomacion = {
            accountActivate: "false",
            photosCar: {
              policeRecord: "false",
            },
          };
          const ref = db.ref(topic);
          ref.update(infomacion);
        }
      } else {
        if (document.policeRecordCert === "null") {
          document.imgActivation.policeRecord = false;
          const infomacion = {
            accountActivate: false,
            photosCar: {
              policeRecord: "false",
            },
          };
          const ref = db.ref(topic);
          ref.update(infomacion);
        } else {
          document.imgActivation.policeRecord = true;
          const infomacion = {
            photosCar: {
              policeRecord: "true",
            },
          };
          const ref = db.ref(topic);
          ref.update(infomacion);
        }
      }
    }
    await document.save();
    await driver.save();
    const infomacion = {
      accountActivate: driver.accountActivate,
      photosCar,
    };
    const ref = db.ref(topic);
    ref.update(infomacion);
    res.status(200).json({ ok: true, document });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const uCarDriverDoc = async (req, res) => {
  const id = req.params.dCarDocId;
  const body = req.body;
  try {
    const document = await carDocument.findById(id);
    const driverId = await carModel.findById(document.carId, { driverId: 1 });
    const driver = await driverModel.findById(driverId.driverId);
    const topic = `settingDriver/${driver._id}`;
    if (body.soatFront) {
      if (body.soatFront == "false") {
        if (document.soatFront !== "null") {
          deletefile(document.soatFront);
          document.soatFront = "null";
          document.imgActivation.soatFront = false;
          driver.accountActivate = false;
          photosCar.soatFront = "false";
        }
      } else {
        if (document.soatFront === "null") {
          document.imgActivation.soatFront = false;
          photosCar.soatFront = "false";
        } else {
          document.imgActivation.soatFront = true;
          photosCar.soatFront = "true";
        }
      }
    }
    if (body.tarjetaPropFront) {
      if (body.tarjetaPropFront === "false") {
        if (document.tarjetaPropFront !== "null") {
          deletefile(document.tarjetaPropFront);
          document.tarjetaPropFront = "null";
          document.imgActivation.tarjetaPropFront = false;
          driver.accountActivate = false;
          photosCar.tarjetaPropFront = "false";
        }
      } else {
        if (document.tarjetaPropFront === "null") {
          document.imgActivation.tarjetaPropFront = false;
          photosCar.tarjetaPropFront = "false";
        } else {
          document.imgActivation.tarjetaPropFront = true;
          photosCar.tarjetaPropFront = "true";
        }
      }
    }
    if (body.tarjetaPropReverse) {
      if (body.tarjetaPropReverse == "false") {
        if (document.tarjetaPropReverse !== "null") {
          deletefile(document.tarjetaPropReverse);
          document.tarjetaPropReverse = "null";
          document.imgActivation.tarjetaPropReverse = false;
          driver.accountActivate = false;
          photosCar.tarjetaPropReverse = "false";
        }
      } else {
        if (document.tarjetaPropReverse === "null") {
          document.imgActivation.tarjetaPropReverse = false;
          photosCar.tarjetaPropReverse = "false";
        } else {
          document.imgActivation.tarjetaPropReverse = true;
          photosCar.tarjetaPropReverse = "true";
        }
      }
    }
    await document.save();
    await driver.save();
    const infomacion = {
      accountActivate: driver.accountActivate,
      photosCar,
    };
    const ref = db.ref(topic);
    ref.update(infomacion);
    res.status(200).json({ ok: true, document });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

/*//Método de Registro de Admin
async function signUp(req, res) {
  if (req.body.password !== req.body.passwordconfirm) {
    res.status(400).json({ success: false, msg: "Passwords do not match." });
    return;
  }

  const adminSearch = await Admin.findOne({ email: req.body.email });
  if (adminSearch) {
    res.status(500).json({ success: false, msg: "El email ya esta en uso" });
  }
  const admin = new Admin({
    name: req.body.name,
    surname: req.body.surname,
    numDocument: req.body.numDocument,
    email: req.body.email,
    cellphone: req.body.cellphone,
    city: req.body.city,
    password: req.body.password,
  });

  admin.password = await admin.encryptPassword(req.body.password);

  admin.save(async function (err, user) {
    if (err) {
      if (err.errors) {
        if (err.errors.name) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.name.message });
          return;
        }
        if (err.errors.surname) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.surname.message });
          return;
        }
        if (err.errors.email) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.email.message });
          return;
        }
        if (err.errors.cellphone) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.cellphone.message });
          return;
        }
        if (err.errors.numDocument) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.numDocument.message });
          return;
        }
        if (err.errors.password) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.password.message });
          return;
        }
        res
          .status(500)
          .json({ success: false, msg: `Error al registrarte: ${err}` });
      }
    } else {
      res
        .status(200)
        .json({ success: true, msg: "Te has registrado correctamente" });
    }
  });
}*/

/*//Método para inicio de sesión de Cliente
async function signIn(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  await Admin.findOne({ email: req.body.email }, function (error, admin) {
    if (error) {
      res
        .status(500)
        .json({ message: `Error al realizar la petición: ${err}` });
    }
    if (!admin) {
      res.status(404).json({ message: "El usuario no existe" });
    } else {
      bcrypt.compare(password, admin.password, function (err, isMatch) {
        if (err) {
          res
            .status(500)
            .json({ message: `error al realizar la petición: ${err}` });
        }
        if (!isMatch) {
          res.status(400).json({ message: `Email o contraseña incorrectos` });
        } else {
          const token = service.createToken(admin);
          return res.status(200).json({
            success: true,
            admin: {
              id: admin._id,
              token: "bearer " + token,
              message: "Te has logueado correctamente",
            },
          });
        }
      });
    }
  });
}*/

const getAllBaucher = async (req, res) => {
  try {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    const bauchers = await BaucherDriver.find()
      .skip(desde)
      .limit(10)
      .sort({ _id: -1 });
    const numbaucher = await BaucherDriver.countDocuments();
    return res.status(200).json({ ok: true, bauchers, total: numbaucher });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};
const getBaucherById = async (req, res) => {
  try {
    let desde = req.query.desde || 0;
    const id = req.params.driverId;
    desde = Number(desde);
    const bauchers = await BaucherDriver.find({ driverId: id })
      .skip(desde)
      .limit(10)
      .sort({ _id: -1 });
    const numbaucher = await BaucherDriver.countDocuments({ driverId: id });
    return res.status(200).json({ ok: true, bauchers, total: numbaucher });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};
const deleteBaucherById = async (req, res) => {
  try {
    const id = req.params.baucherId;
    const baucher = await BaucherDriver.findOneAndDelete({ _id: id });
    return res.status(200).json({ ok: true, borrado: baucher });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};
const updateBaucherById = async (req, res) => {
  try {
    const id = req.params.baucherId;
    const baucher = await BaucherDriver.findOne({ _id: id });
    baucher.valido = req.body.valido;
    let img = req.body.img;
    if (img === "delete") {
      if (baucher.img !== "null") deletefile(baucher.img);
      baucher.img = "null";
    }
    await baucher.save();
    return res.status(200).json({ ok: true, modificado: baucher });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

const cantUserDriver = async (req, res) => {
  try {
    const userTotal = await userModel.find().count();
    const userActivos = await userModel
      .find({ accountActivate: false })
      .count();
    const driverTotal = await driverModel.find().count();
    const driverActivos = await driverModel
      .find({ accountActivate: true })
      .count();
    return res
      .status(200)
      .json({ data: { userTotal, userActivos, driverTotal, driverActivos } });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

// Rating del driver y datos por id
const getDriverRatingBy = async (req, res) => {
  try {
    const data = {
      sumatoria: null,
      total: null,
      estrella: null,
      numDocument: null,
      surname: null,
      name: null,
      email: null,
    };
    const strats = await DriverStarts.findOne(
      { driverId: req.params.id },
      { sumatoria: 1, total: 1 }
    ).populate(
      "driverId",
      { numDocument: 1, surname: 1, name: 1, email: 1 },
      driverModel
    );
    data.sumatoria = strats.sumatoria;
    data.total = strats.total;
    data.estrella = strats.sumatoria / strats.total;
    data.numDocument = strats.driverId.numDocument;
    data.surname = strats.driverId.surname;
    data.name = strats.driverId.name;
    data.email = strats.driverId.email;
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

module.exports = {
  GetAllUsers,
  GetAllDrivers,
  updateUserById,
  updateDriverById,
  uProfile,
  dProfile,
  dDcocument,
  dDocCar,
  getdriver,
  uDriverDoc,
  uCarDriverDoc,
  signIn,
  signUp,
  getAllBaucher,
  getBaucherById,
  deleteBaucherById,
  updateBaucherById,
  cantUserDriver,
  getDriverRatingBy,
};
