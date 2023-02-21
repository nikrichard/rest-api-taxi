'use static'

const Cupon = require('../models/coupon');
const userCoupon = require('../models/userCoupon');
const USER = require('../models/userModel')


//Método de Registro de Cliente

const registarCupon = async(req,res)=>{
    try {
        if(req.body.expire > req.body.fechaIni){
            const existecupon = await Cupon.findOne({key:req.body.key})
            data = {
                date: req.body.fechaIni,
                value: req.body.value,
                cant: req.body.cant,
                expire: req.body.expire,
                name: req.body.name,
                key: req.body.key,
                creator: req.body.creator,
                expireuser: req.body.expireuser
            }        
            // console.log(data.expireuser);
            if(!existecupon) {
                const cupon = new Cupon(data)
                await cupon.save()
                res.status(200).json({ok:true,msg:"Cupon creado"});
            }
            else res.status(403).json({ok:false,msg:'Ya existe cupon con esa key'});
        }
        else res.status(403).json({ok:false,msg:"fecha inicial debe ser mayor"});
    } catch (error) {
        res.status(500).json({ok:false,error})
    }     
}

const userGetCoupon = async(req,res)=>{
    const userid = req.body.userId;
    const key = req.body.key;
    const fechanow = Date.now();

    USER.findById(userid).exec((err,user)=>{
        if(err) return res.status(500).json({ok:false,err})
        if(!user) return res.status(404).json({ok:false,msg:"no se encontro user"})
        else {
            Cupon.findOne({key:key}).exec((err,cupon)=>{
                if(err) return res.status(500).json({ok:false,err})
                if(!cupon) return res.status(404).json({ok:false,msg:"no se encontro cupon con esa key"})
                if(cupon.expire-fechanow < 0 || cupon.expireuser-fechanow < 0) return res.status(400).json({msg:"Expiro!!!!! hace"+((cupon.expire-fechanow)/3.6e+6)})
                if(cupon.cant>0){
                    userCoupon.findOne({userId:userid,couponId:cupon._id}).exec((err,cuponuser)=>{
                        if(err) return res.status(500).json({ok:false,err})
                        if(!cuponuser) {
                            
                            const usercupon = new userCoupon({userId:userid,couponId:cupon._id,value:cupon.value})
                            usercupon.save((err)=>{
                                if(err) return res.status(500).json({ok:false,err});
                            })
                            cupon.cant = cupon.cant - 1;
                            cupon.save((err)=>{if(err) return res.status(500).json({ok:false,err});})
                            return res.status(200).json({ok:true,msg:"Se añadio un cupon"})
                        }
                        return res.status(400).json({ok:false,msg:"ya tiene este cupon"});
                    })
                }
                else {return res.status(400).json({msg:"llegaste tarde"})}
            })
        }
    })    
}

const getAllCoupon = async (req,res)=>{    
    try {
        const cupones = await Cupon.find();
        if(!cupones) return res.status(404).json({ok:false})
        else return res.status(200).json({ok:true,cupones:cupones})
    } catch (error) {
        res.status(500).json({ok:false,error})
    }
    
}

const deleteCoupon = async (req,res)=>{
    try {
        const cupon = await Cupon.findOneAndDelete({_id:req.params.cuponId});
        res.status(200).json({ok:true,msg:"eliminado",cupon});
    } catch (error) {
        res.status(500).json({ok:false,error})
    }
}

const updateCoupon = async (req,res)=>{
    try {
        if(req.body.fechaIni<req.body.expire){
            const cupon = await Cupon.findOne({_id:req.params.cuponId});
            cupon.date = req.body.fechaIni;
            cupon.value = req.body.value || cupon.value;
            cupon.cant = req.body.cant || cupon.cant;
            cupon.expire = req.body.expire;
            cupon.name = req.body.name || cupon.name;
            cupon.expireuser = req.body.expireuser;
            await cupon.save();
            return res.status(200).json({ok:true,msg:"modificado",cupon});
        }
        if(!req.body.fechaIni && !req.body.expire){
            const cupon = await Cupon.findOne({_id:req.params.cuponId});
            cupon.value = req.body.value || cupon.value;
            cupon.cant = req.body.cant || cupon.cant;
            cupon.name = req.body.name || cupon.name;
            cupon.expireuser = req.body.expireuser;
            await cupon.save();
            return res.status(200).json({ok:true,msg:"modificado",cupon});
        }
        else res.status(403).json({ok:false,msg:"fecha ini debe ser mayor"});
    } catch (error) {
        res.status(500).json({ok:false,error})
    }
}

module.exports = {
    registarCupon,
    userGetCoupon,
    getAllCoupon,
    deleteCoupon,
    updateCoupon
}

