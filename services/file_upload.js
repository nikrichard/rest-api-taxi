var aws = require('aws-sdk')
var multer = require('multer')
var multerS3 = require('multer-s3')
var moment = require('moment');

const config_s3 = require('../config/aws-s3');

let nimetype = new String(); 

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg'){
        nimetype=file.mimetype
      cb(null, true)
    }else{
      cb(new Error('El formato es invalido, solo está permitido SVG, PNG, JPG y JPEG'), false)
    }
  }

var s3 = new aws.S3({ 
    accessKeyId: config_s3.ID,
    secretAccessKey: config_s3.SECRET,
    region: config_s3.REGION
})
 // user y driver
var uploadProfile = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        acl:'public-read',
        limits: {fileSize: 30000000}, 
        bucket: config_s3.BUCKET_NAME,
        metadata: function (req, file, cb) {
        cb(null, { OWNER: config_s3.METADATA, id: nimetype, date:Date.now().toString()});
        },
        key: function (req, file, cb) {
            let last = nimetype.split('/')
            cb(null, req.params.type+'/' + req.params.id +'/'+file.fieldname+"." + last[1]);
        }
    })
})

// driver documents
var uploadDocument = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        acl:'public-read',
        limits: {fileSize: 30000000}, 
        bucket: config_s3.BUCKET_NAME,
        metadata: function (req, file, cb) {
        cb(null, { OWNER: config_s3.METADATA, id: nimetype, date:Date.now().toString()});
        },
        key: function (req, file, cb) {
            let last = nimetype.split('/')
            cb(null, 'driver/' + req.params.id +'/DocumentDriver/'+file.fieldname+"." + last[1]);
        }
    })
})

// card documents
var uploadCarDoc = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        acl:'public-read',
        limits: {fileSize: 30000000}, 
        bucket: config_s3.BUCKET_NAME,
        metadata: function (req, file, cb) {
        cb(null, { OWNER: config_s3.METADATA, id: nimetype, date:Date.now().toString()});
        },
        key: function (req, file, cb) {
            let last = nimetype.split('/')
            cb(null, 'driver/' + req.params.id +'/DocumentCar/'+file.fieldname+"." + last[1]);
        }
    })
})

// driver documents
var uploadPayment = multer({
    fileFilter,
    storage: multerS3({
        s3: s3,
        acl:'public-read',
        limits: {fileSize: 30000000}, 
        bucket: config_s3.BUCKET_NAME,
        metadata: function (req, file, cb) {
        cb(null, { OWNER: config_s3.METADATA, id: nimetype, date:Date.now().toString()});
        },
        key: function (req, file, cb) {
            let last = nimetype.split('/')
            let now = moment().format('YYYY-MM-DD');
            cb(null, 'driver/baucher/'+now+'/'+req.params.id+"." + last[1]);
        }
    })
})

// delete file

const deletefile = (key)=>{
    var params = {
        Bucket: config_s3.BUCKET_NAME, 
        Key: key
    };
    s3.deleteObject(params, function(err, data) {
        if (err) return false // an error occurred
        else return true // successful response
    });
}

module.exports = {
  uploadProfile,
  uploadDocument,
  uploadCarDoc,
  deletefile,
  uploadPayment
  };