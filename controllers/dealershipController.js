'use strict'
const Dealership = require('../models/dealershipModel')
const bcrypt = require('bcryptjs');

//Función para registrar nueva concesionaria
async function registrationDealership(req,res){
    
    const nameDealership = req.body.nameDealership
    const country = req.body.country
    const departament = req.body.departament
    const province = req.body.province
    const locality = req.body.locality
    
    let codeDealership;

    try{
        const lenghtDealershipCollection = await Dealership.find()

        if(!lenghtDealershipCollection){
            res.status(404).json({status:true, message:"Error al buscar la colección"})
        }else{
            
            let nameDealer = await Dealership.findOne({nameDealership: nameDealership})
            
            if(nameDealer){
                res.status(401).json({status: false, message: "El nombre ingresado ya está en uso"})
            }else{
                if(lenghtDealershipCollection.length == 0){
                    let numDealership = String(lenghtDealershipCollection.length + 1)    
                    codeDealership = "e" + numDealership.padStart(5,"0")
                }else{
                    //Capturo la ultima empresa registrada
                    let lastDealership = lenghtDealershipCollection[lenghtDealershipCollection.length - 1]
                    let lastCode = lastDealership.codeDealership.substr(1,5) //Capturo el código
                    let numDealership = String(Number(lastCode) + 1) // incremento en 1 al ultimo código y lo convierto en String
                    codeDealership = "e" + numDealership.padStart(5,"0") //Estructuro el código de la empresa a registrar
                }
                
                const dealership = new Dealership({ //Modelo Concesionaria
                    codeDealership: codeDealership,
                    nameDealership: nameDealership,
                    country: country,
                    departament: departament,
                    province: province,
                    locality: locality
                })
    
                //Guardamos la colección en la base de datos
                await dealership.save((err,dealer)=>{
                    if(err){
                        res.status(500).json({status:false, message: `Error: ${err}`})
                    }if(dealer){
                        res.status(200).json({status: true, message: 'Se registró correctamente la concesionaria'})
                    }
                })
            }
            
        }
    }catch(err){
        res.status(500).json({status:false, message: `Error: ${err}`})
    }

}

//función para enviar todas las concesionarias registradas de 10 en 10
async function getAllDealerships(req,res){
    let desde = req.query.desde || 0;
    desde = Number(desde)
    try{
        const dealerships = await Dealership.find(
            {},
            {
                codeDealership: 1,
                nameDealership: 1,
                country: 1,
                departament: 1,
                province: 1,
                locality: 1,
                activateDealership: 1,
                registrationDate: 1
            }
        )
        .skip(parseInt(desde))
        .limit(10)
        .sort({_id: -1}); //-1 para descendente y 1 para ascendente
        const countDealerships = await Dealership.countDocuments();
        return res.status(200).json({status: true, dealerships, total: countDealerships});
    }catch(err){
        return res.status(500).json({err});
    }
}

//Función para ver la información de una concesionaria
async function getDealershipByCode(req,res){
    const codeDealership = req.params.codeDealership;
    try {
        const dealership = await Dealership.findOne({codeDealership: codeDealership})
        if(!dealership){
            res.status(404).json({ status: false, message: "La concesionaria no existe" });
        }else{
            res.status(200).json({ status: true, dealership: dealership});
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

//Función para eliminar una concesionaria
async function deleteDealership(req,res){
    const codeDealership = req.params.codeDealership;
    try {
        await Dealership.findOneAndDelete({ codeDealership: codeDealership }, (error, dealership)=>{
            if(error){
                return res.status(200).json({ status: false, message: error});        
            }else{
                return res.status(200).json({ status: true, message: "Se eliminó correctamente la concesionaria" });
            }
        });
    } catch (error) {
        return res.status(500).json({ error });
    }
}

//Función para habilitar o deshabilitar concesionaria
async function updateDealershipByCode(req,res){
    const codeDealership = req.params.codeDealership;
    const body = req.body;
    const update = {
        codeDealership: codeDealership,
        nameDealership: body.nameDealership,
        country: body.country,
        departament: body.departament,
        province: body.province,
        locality: body.locality,
        activateDealership: body.activateDealership
    };
    try {
        const dealership = await Dealership.findOneAndUpdate({codeDealership: codeDealership}, update, { new: true });
        if (!dealership){
            return res.status(200).json({ status: false, message: "No se encontró la concesionaria" });
        }else{
            return res.status(200).json({ status: true, dealership });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports = {
    registrationDealership,
    getAllDealerships,
    getDealershipByCode,
    deleteDealership,
    updateDealershipByCode
}

//Error 403 Operacion que está prohibida para el usuario