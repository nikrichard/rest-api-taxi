'use strict'

const express = require('express')
const api = express.Router()
const cors = require('cors')
const DriverNotification=require('../controllers/DriverNotification')

api.post('/setAdminMsgNotificationSend',cors(),DriverNotification.AdminMsgNotificationSend)
api.post('/setOneAdmintMsgNotificationSend',cors(),DriverNotification.AdminOneMsgNotificationsend)
api.post('/setAdminCreateOneMsgNotification',cors(),DriverNotification.AdminCreateOneMsgNotification)
api.post('/setCreateOneMsgNotificationAndSendMsgToDriver',cors(),DriverNotification.CreateOneMsgNotificationAndSendMsgToDriver)
api.get('/getDriverMsgNotificationFindByID/:DriverID',cors(),DriverNotification.DriverMsgNotificationFindByID)
api.get('/getDriverMsgNotificationFindByAdminID/:AdminID',cors(),DriverNotification.DriverMsgNotificationFindByAdminID)
api.get('/getMsgNotificationFindByAdminID/:AdminID/:desde',cors(),DriverNotification.MsgNotificationFindByAdminID)
api.put('/setUpdateMessageByID',cors(),DriverNotification.UpdateMessageByID)
api.put('/UpdateMessageStatusById',cors(),DriverNotification.UpdateMessageStatusById)
api.delete('/setDeleteMessageByID/:MessageID',cors(),DriverNotification.DeleteMessageByID)
api.delete('/setDeleteOneMessageByID/:MessageID',cors(),DriverNotification.DeleteOneMessageByID)


module.exports = api;