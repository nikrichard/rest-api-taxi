"use static";

const Referido = require("../models/referido");
const Cupon = require("../models/coupon");
const UserCoupon = require("../models/userCoupon");
const Ewallet = require("../models/ewallet");
const User = require("../models/userModel");

const { makeid } = require("../services/nodemailer");

let referAddCoin = 0;

//Método de Registro de Cliente

const getCodigoReferido = async (req, res) => {
  try {
    const id = req.params.id;
    const ewallet = await Ewallet.findOne(
      { user: id },
      { cardId: 1, value: 1 }
    );
    if (!ewallet) return res.status(404).json();
    return res.status(200).json({ ewallet });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
};

const userPutReferido = async (req, res) => {
  const id = req.params.id;
  const key = req.body.key;
  try {
    const { refer } = req.query;
    if (refer === "driver") referAddCoin = 1.5;
    if (refer === "user") referAddCoin = 1;
    const userRefiere = await User.findOne({ _id: id, isReferred: false });
    if (!userRefiere)
      return res.status(404).json({ mensaje: "no se encontro referido" });
    const userReferido = await User.findOne({ codeEvans: key }, { _id: 1 });
    if (!userReferido)
      return res.status(404).json({ mensaje: "no se encontro referido" });
    if (userRefiere._id === userReferido._id)
      return res.status(404).json({ mensaje: "no se encontro referido" });
    const ewallet = await Ewallet.findOne({ user: userReferido._id });
    if (!ewallet)
      return res.status(404).json({ mensaje: "no se encontro ewallet" });
    userRefiere.isReferred = true;
    ewallet.value = ewallet.value + referAddCoin; // Aumentamos un sol
    await userRefiere.save();
    await ewallet.save();
    return res.json({ mensaje: "Exitoso" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const findReferido = async (req, res) => {
  const key = req.params.key;
  try {
    const userReferido = await User.findOne({ codeEvans: key }, { _id: 1 });
    if (!userReferido) return res.status(200).json({ status: false });
    return res.json({ status: true });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = {
  getCodigoReferido,
  userPutReferido,
  findReferido,
};
