'use static'
const UserProfileImage = require('../models/userProfileImageModel')
const User = require('../models/userModel')
const Dealership = require('../models/dealershipModel')
const db = require("../services/firebase").db;

//Método para traer la información de la imagen del usuario
async function getUserProfileImage(req,res){
    const codeDealership = req.params.codeDealership
    const userId = req.params.userId
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
            const userProfileImage = await UserProfileImage.findOne({userId:userId}, (error)=>{
                if(error){
                    res.status(500).json({
                        success: false,
                        message: `Error al realizar la busqueda del usuario` 
                    })
                }
            })
            if(!userProfileImage){
                res.status(404).json({
                    success: true,
                    message: `La imagen de usuario no existe` 
                })
            }else{
                res.status(200).json({
                    success: true,
                    userProfileImage: userProfileImage
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error: ${error}`
        })
    }
}

//Método para subir y actualizar la imagen de perfil del usuario
async function updateUserProfileImage(req,res){
    const codeDealership = req.params.codeDealership
    const userId = req.params.userId
    const urlUserProfileImage = req.body.urlUserProfileImage
    const updateProfileImage = {
        imageActivation: "pending",
        profileImage: urlUserProfileImage,
        imageUpdate: false
    };
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
            const userProfileImage = await UserProfileImage.findOneAndUpdate({userId:userId}, updateProfileImage, {new:true})
            if(!userProfileImage){
                return res.status(404).json({ 
                  status: false, 
                  message: "No existe imagen de usuario" 
                });
            }else{
                const topic = `settingDriver/${codeDealership}/${userId}/imgProfileFirebase`;
                const ref = db.ref(topic);
                ref.update(updateProfileImage);
                return res.status(200).json({
                    success: true, 
                    message: "Se actualizó correctamente la imagen" 
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

//Función para activar y desactivar la imagen de perfil del usuario
async function validateUserProfileImage(req,res){
    const codeDealership = req.params.codeDealership
    const userId = req.params.userId
    const imageActivation = req.body.imageActivation
    const updateImageActivation = {
        imageActivation: imageActivation,
    };
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
            const userProfileImage = await UserProfileImage.findOneAndUpdate({userId:userId}, updateImageActivation, {new:true})
            if(!userProfileImage){
                return res.status(404).json({ 
                  status: false, 
                  message: "No existe imagen de usuario" 
                });
            }else{
                const topic = `settingDriver/${codeDealership}/${userId}/imgProfileFirebase`;
                const ref = db.ref(topic);
                ref.update(updateImageActivation);
                return res.status(200).json({
                    success: true, 
                    message: "Se actualizó correctamente el estado de activavión" 
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

//Método para despertar la API
async function apiActivate(req,res){
    const codeDealership = req.params.codeDealership
    try{
        const dealership = await Dealership.findOne({codeDealership: codeDealership}, (error)=>{
            if(error){
                res.status(500).json({
                    success: false, 
                    message: `Error al realizar la busqueda del usuario`
                })    
            }
        })
        if(!dealership){
            res.status(404).json({
                success: true, 
                message: `No existe la concesionaria`
            })
        }else{
            res.status(200).json({
                success: true, 
                message: `La api está despierta...`
            })
        }
    }catch(error){
        res.status(500).json({
            success: false, 
            message: `Error: ${error}`
        }) 
    }
}

module.exports = {
    getUserProfileImage,
    updateUserProfileImage,
    validateUserProfileImage,
    apiActivate
}