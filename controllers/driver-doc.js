'use static'

const DRIVER_DOC = require('../models/driver-doc')

function postDriverDoc(req,res){


	const driver_doc = new DRIVER_DOC({
	        creator: req.session.user_id,
	        licencia: req.body.licencia,
	        ven_licencia: req.body.ven_licencia,
	        categoria_licencia: req.body.categoria_licencia
	      });

	      driver_doc.save((err,driver_docStored) =>{
		if (err) res.status(500).json({message: `error al guardar los datos: ${err}`})
		res.status(200).json({driver_doc: driver_docStored})
	      });
}

 module.exports={
	postDriverDoc
}