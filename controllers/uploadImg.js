'use static'
const upload = require('../services/file_upload')
const userprofile = require('../models/userProfileImageModel')
const usermodel = require('../models/userModel')
const DriverDocuments = require('../models/driverDocuments')
const carmodel = require('../models/carModel')
const cardocument = require('../models/carDocumentsModel')
const PaymentModel = require('../models/driverPayment')

const fileName = ['profile','policeRecordCert','criminalRecodCert','driverLicense','SOAT','propertyCardForward','propertyCardBack','baucherImg']
// ===========================================================================================
// upload usuarios y drivers
// ===========================================================================================
const profileUserDriver = (req,res)=>{
    const singleUpload = upload.uploadProfile.single(fileName[0]);
    let type = req.params.type;        // driver o user
    let id = req.params.id.toString();          // id del user o driver
    if(type === 'user' || type === 'driver'){       
        usermodel.findById(id,(err, usuario)=>{
            if(err){
                return res.status(500).json({err})
            }
            if(!usuario){
                return res.status(400).json({mensaje:'No se encontro user con ese id'})
            }
            singleUpload(req,res,(err)=>{                    
                if(err) {
                    return res.json({error:err})
                }
                try {
                    let url = req.file.key;
                    userprofile.findOne({userCreator: id},(err, userprofile)=>{
                        if(err) {return res.status(500).json({err})}
                        if (!userprofile) {return res.status(400).json({mensaje:'No se encontro profile con ese id'})}
                        if(url !== userprofile.imgPerfil) upload.deletefile(userprofile.imgPerfil);
                        userprofile.imgPerfil = url;      
                        userprofile.save((err,imgupload)=>{
                            if(err){
                                return res.status(400).json({ok:false,err})
                            }
                            return res.status(200).json({ok:true,message:'Imagen subida - user'})
                        })
                    }) 
                } catch (error) {
                    return res.json({error:"file not existed"})
                }                                  
            });
        })       
        
    } 
    else{
        return res.status(404).json({message:'url no valida'})
    }
}
// ===========================================================================================
// upload documentos del driver
// ===========================================================================================

const upLoadDriverDocuments = (req,res)=>{    
    let singleUpload;
    let id = req.params.id.toString();
    let nameDoc = req.url;
    nameDoc = nameDoc.split('/');
    nameDoc = nameDoc[4].toLowerCase();

    if(nameDoc === fileName[1].toLowerCase()){singleUpload = upload.uploadDocument.single(fileName[1]);}
    if(nameDoc === fileName[2].toLowerCase()){singleUpload = upload.uploadDocument.single(fileName[2]);} 
    if(nameDoc === fileName[3].toLowerCase()){singleUpload = upload.uploadDocument.single(fileName[3]);}

    usermodel.findById(id,(err, driver)=>{
        if(err){
            return res.status(500).json({err})
        }
        if(!driver){
            return res.status(400).json({mensaje:'No se encontro driver con ese id'})
        }
        singleUpload(req,res,(err)=>{
            if(err) return res.status(500).json({err})
            try {
                let url = req.file.key;
                DriverDocuments.findOne({driverId: id},(err, DriverDocuments)=>{
                if(err) {return res.status(500).json({err})}
                if (!DriverDocuments) {return res.status(400).json({mensaje:'No se encontro profile con ese id'})}
                if(nameDoc === fileName[1].toLowerCase()){
                    if(url !== DriverDocuments.policeRecordCert) upload.deletefile(DriverDocuments.policeRecordCert);      
                    DriverDocuments.policeRecordCert = url;
                }                
                if(nameDoc === fileName[2].toLowerCase()){
                    if(url !== DriverDocuments.criminalRecodCert) upload.deletefile(DriverDocuments.criminalRecodCert);                    
                    DriverDocuments.criminalRecodCert = url;
                }            
                if(nameDoc === fileName[3].toLowerCase()){
                    if(url !== DriverDocuments.licence) upload.deletefile(DriverDocuments.licence);                    
                    DriverDocuments.licence = url;
                }          
                DriverDocuments.save((err,imgupload)=>{
                    if(err){
                        return res.status(400).json({ok:false,err})
                    }
                    return res.status(200).json({ok:true,message:'Imagen subida - driver'})
                })
            })   
            } catch (error) {
                return res.json({error:"file not existed"})
            }                            
        });
    })
}

const upLoadCarDocuments = (req,res)=>{
    let singleUpload;
    let id = req.params.id.toString();
    let nameDoc = req.url;
    nameDoc = nameDoc.split('/');
    nameDoc = nameDoc[4].toLowerCase();
    if(nameDoc === fileName[4].toLowerCase()){singleUpload = upload.uploadCarDoc.single(fileName[4]);}
    if(nameDoc === fileName[5].toLowerCase()){singleUpload = upload.uploadCarDoc.single(fileName[5]);} 
    if(nameDoc === fileName[6].toLowerCase()){singleUpload = upload.uploadCarDoc.single(fileName[6]);}

    carmodel.findOne({driverId:id},(err, auto)=>{
        if(err){
            return res.status(500).json({err})
        }
        if(!auto){
            return res.status(400).json({mensaje:'No tiene un auto asociado'})
        }
        singleUpload(req,res,(err)=>{
            if(err) return res.status(500).json({err})
            try {
                let url = req.file.key;
                cardocument.findOne({carId: auto._id},(err, cardocument)=>{
                if(err) {return res.status(500).json({err})}
                if (!cardocument) {return res.status(400).json({mensaje:'No se encontro document con ese id'})}
                if(nameDoc === fileName[4].toLowerCase()){
                    if(url !== DriverDocuments.soatFront) upload.deletefile(DriverDocuments.soatFront);
                    cardocument.soatFront = url;
                }               
                if(nameDoc === fileName[5].toLowerCase()){
                    if(url !== DriverDocuments.tarjetaPropFront) upload.deletefile(DriverDocuments.tarjetaPropFront);
                    cardocument.tarjetaPropFront = url;
                }               
                if(nameDoc === fileName[6].toLowerCase()){
                    if(url !== DriverDocuments.tarjetaPropReverse) upload.deletefile(DriverDocuments.tarjetaPropReverse);
                    cardocument.tarjetaPropReverse = url;
                }
                cardocument.save((err,imgupload)=>{
                    if(err){
                        return res.status(400).json({ok:false,err})
                    }
                    return res.status(200).json({ok:true,message:'Imagen subida - doc/auto'})
                })
            })   
            } catch (error) {
                return res.json({error:"file not existed"})
            }                            
        });
    })
}

const baucherDriver = (req,res)=>{
    const singleUpload = uploadPayment.single(fileName[7]);
    let id = req.params.id.toString();
    
    PaymentModel.findById(id,(err, pago)=>{
        if(err){
            return res.status(500).json({err})
        }
        if(!pago){
            return res.status(400).json({mensaje:'No se encontro pago'})
        }
        singleUpload(req,res,(err)=>{                 
            if(err) {
                return res.json({error:err})
            }
            try {
                let url = req.file.key;
                if(url !== pago.img) upload.deletefile(pago.img);
                pago.img = url;
                pago.save((err,imgupload)=>{
                    if(err){
                        return res.status(400).json({ok:false,err})
                    }
                    return res.status(200).json({ok:true,message:'Imagen subida'})
                })
             
            } catch (error) {
                return res.json({error:"file not existed"})
            }                                  
        });
    })    
}


module.exports = {
    profileUserDriver,
    upLoadDriverDocuments,
    upLoadCarDocuments,
    baucherDriver
}
