'use strict'

const ActivateCoupons = require('../models/activateCoupons');

async function ActivateCoupon(req,res){
	const coupon = new ActivateCoupons({
		name: req.body.name,
		monto: req.body.monto,
	    status: req.body.status,
	    numberCoupons: req.body.numberCoupons,
	    statusNumberCoupons: req.body.statusNumberCoupons
	})

	await coupon.save( async function(err, coupon){
		if (err) {
			res.status(500).json({message: `Error: ${err}`})
		}else{

			res.status(200).json({message: 'se guardo el cupon correctamente'})
		}
	});

}
 
module.exports = {
	ActivateCoupon
}