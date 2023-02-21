'user strict'
const services = require('../services/JWTService')

module.exports = function authAdmin(req, res , next){
    if(req.path != '/admin/signin'){
        if(req.headers.authorization){
            const token = req.headers.authorization.split(' ')[1]
            services.decodeToken(token)
            .then((response) => {
                if(response.role != "admin"){
                    if(response.role == "dealership"){ //Rutas con el rol de tipo "dealership"
                        if(req.path == `/admin/getInformationAdmin/${req.params.adminId}`){
                            next()
                        }else if(req.path == `/admin/getUsersByDealershipCode/${req.params.codeDealership}`){
                            next()
                        }else if(req.path == `/admin/getInfoUserByDealershipCode/${req.params.codeDealership}`){
                            next()
                        }else if(req.path == `/admin/getCarInformation/${req.params.userId}`){
                            next()
                        }else if(req.path == `/admin/updateCarInformation/${req.params.userId}`){
                            next()
                        }else if(req.path == `/admin/getUserProfileImage/${req.params.codeDealership}/${req.params.userId}`){
                            next()
                        }else if(req.path == `/admin/validateUserProfileImage/${req.params.codeDealership}/${req.params.userId}`){
                            next()
                        }else if(req.path == `/admin/activateAccountAsDriver/${req.params.codeDealership}/${req.params.userId}`){
                            next()
                        }else if(req.path == `/admin/getUsersEnabledAsDrivers/${req.params.codeDealership}`){
                            next()
                        }
                        else{
                            return res.status(403).json({success: false, message: "La url es incorrecta o invalida"})                
                        }
                    }else{
                        return res.status(403).json({success: false, message: "No tienes autorización para acceder"})            
                    }//Fin de la condicional else de los roles de tipo "dealership"
                }else{
                    next()
                }
            })
            .catch((response) => {
                return res.status(response.status).json({success: false, message: response.message})
            })
        }else{
            return res.status(403).json({success: false, message: "No tienes autorización para acceder"})
        }                
    }else{
        next()
    }
}