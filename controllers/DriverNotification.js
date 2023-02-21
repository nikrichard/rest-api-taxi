"use static";

const MessageNotification = require("../models/AdminMessageNotification");
const DriverNotification = require("../models/AdminDriverNotification");
const Driver = require("../models/userModel");
const AdminModel = require("../models/adminModel");
const moment = require("moment");
moment.locale("es");

async function AdminMsgNotificationSend(req, res) {
  const { title, description, CreatorAdmin } = req.body;
  const Notification = new MessageNotification({
    title: title,
    description: description,
    CreatorAdmin: CreatorAdmin,
  });
  await Notification.save(async (err, data) => {
    let _idMessage = data._id;
    if (err) return res.status(500).json({ ok: false, resp: err });
    if (data) {
      await Driver.find()
        .select("_id")
        .exec(async (err, list) => {
          let arr = [];
          if (err) {
            return res.status(500).json({ ok: false, resp: err });
          }
          if (!list) {
            return res
              .status(500)
              .json({ ok: false, resp: "No hay registros..." });
          } else {
            list.forEach((value, i) => {
              arr[i] = {
                Driver: value._id,
                Message: _idMessage,
              };
            });
            await DriverNotification.insertMany(arr)
              .then((_) => {
                res.status(200).json({ ok: true });
              })
              .catch((err) => {
                return res.status(500).json({ ok: false, resp: err });
              });
          }
        });
    }
  });
}
async function AdminOneMsgNotificationsend(req, res) {
  const { MessageID, DriverID } = req.body;
  const Notification = new DriverNotification({
    Driver: DriverID,
    Message: MessageID,
  });
  await Notification.save((err) => {
    if (err) return res.status(500).json({ ok: false, resp: err });
    return res.json({ ok: true });
  });
}

// add mqqt send msg
async function CreateOneMsgNotificationAndSendMsgToDriver(req, res) {
  const { title, description, CreatorAdmin, DriverID } = req.body;
  try {
    const Notification = new MessageNotification({
      title: title,
      description: description,
      CreatorAdmin: CreatorAdmin,
    });
    const result = await Notification.save();
    const DriverNotifi = new DriverNotification({
      Driver: DriverID,
      Message: String(result._id),
    });
    await DriverNotifi.save();

    res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, resp: err });
  }
}

async function AdminCreateOneMsgNotification(req, res) {
  const { title, description, CreatorAdmin } = req.body;
  const Notification = new MessageNotification({
    title: title,
    description: description,
    CreatorAdmin: CreatorAdmin,
  });
  Notification.save((err, Msg) => {
    if (err) return res.status(500).json({ ok: false, resp: err });
    return res.status(200).json({ ok: true });
  });
}
async function DriverMsgNotificationFindByID(req, res) {
  try {
    let findData = { Driver: req.params.DriverID };

    const Messages = await DriverNotification.find(findData)
      .populate({
        path: "Message",
        model: MessageNotification,
        populate: {
          path: "CreatorAdmin",
          model: AdminModel,
          select: "role",
        },
      })
      .sort({ state: 1, _id: -1 });
    let arr = [];
    Messages.forEach((val, i) => {
      arr[i] = {
        title: val.Message.title,
        description: val.Message.description,
        state: val.state,
        user: val.Message.CreatorAdmin.role,
        FHregister: moment(val.FHsend).fromNow(),
        MessageID: val._id,
      };
    });
    res.status(203).json({ ok: true, Notificacion: arr });
  } catch (error) {
    res.status(500).json({ ok: false, error });
  }
}

async function UpdateMessageByID(req, res) {
  const { MessageID, title, description } = req.body;
  await MessageNotification.updateOne(
    { _id: MessageID },
    { title: title, description: description },
    (err, _) => {
      if (err) return res.status(500).json({ ok: false, resp: err });
      return res.status(200).json({ ok: true });
    }
  );
}
async function UpdateMessageStatusById(req, res) {
  const { MessageID, state } = req.body;

  await DriverNotification.updateOne(
    { _id: MessageID },
    { state: state },
    (err, _) => {
      if (err) return res.status(500).json({ ok: false, resp: err });
      return res.status(200).json({ ok: true });
    }
  );
}

async function DeleteOneMessageByID(req, res) {
  const MessageID = req.params.MessageID;
  await DriverNotification.deleteOne({ _id: MessageID }, (err, _) => {
    if (err) return res.status(500).json({ ok: false, resp: err });
    return res.status(200).json({ ok: true });
  });
}

async function DeleteMessageByID(req, res) {
  const { MessageID } = req.params;
  try {
    await DriverNotification.deleteMany({ Message: MessageID });
    await MessageNotification.deleteOne({ _id: MessageID });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ ok: false, resp: err });
  }
}

async function DriverMsgNotificationFindByAdminID(req, res) {
  const { AdminID } = req.params.AdminID;

  return "";
}

async function MsgNotificationFindByAdminID(req, res) {
  const desde = Number(req.params.desde) || 0;
  const findData = { CreatorAdmin: req.params.AdminID };
  await MessageNotification.find(findData)
    .skip(desde)
    .limit(10)
    .sort({ FHregister: -1 })
    .exec(async (err, list) => {
      if (err) {
        return res.status(500).json({ ok: false, resp: err });
      }
      if (!list) {
        return res.status(500).json({ ok: false, resp: "No hay registros..." });
      } else {
        const total = await MessageNotification.countDocuments();
        return res.status(200).json({ ok: true, total: total, Message: list });
      }
    });
}
module.exports = {
  AdminMsgNotificationSend,
  AdminOneMsgNotificationsend,
  DriverMsgNotificationFindByID,
  UpdateMessageByID,
  DeleteMessageByID,
  UpdateMessageStatusById,
  DeleteOneMessageByID,
  DriverMsgNotificationFindByAdminID,
  MsgNotificationFindByAdminID,
  AdminCreateOneMsgNotification,
  CreateOneMsgNotificationAndSendMsgToDriver,
};
