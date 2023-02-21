'use static'

const User = require('../models/userModel');
const DriverPayment = require('../models/driverPayment');

// ===========================================================================================
// update usuarios y drivers
// ===========================================================================================

const registerPayment = async (req,res)=>{
    try {
        const id = req.params.driverId;
        const fechaVaucher = req.body.fecha;
        const driver = await User.findById(id);
        if(!driver) res.status(404).json({ok:false});
        const documento = await DriverPayment.findOne({"driverId":id,"serie":req.body.serie});        
        if(!documento){
            const data = new DriverPayment({
                driverId: id,
                serie: req.body.serie,
                monto: req.body.monto,
                fechaVaucher: fechaVaucher
              });
              await data.save();
              res.status(200).json({ok:true,idPago:documento._id})
        } 
        if(documento){
            documento.serie=req.body.serie;
            documento.monto=req.body.monto;
            documento.fechaVaucher=fechaVaucher;
            documento.fechaRegistro=Date.now();
            await documento.save();
            res.status(200).json({ok:true,idPago:documento._id})
        }
    } catch (error) {
        res.status(500).json({ok:false,error})
    }
}

module.exports = {
    registerPayment
}
