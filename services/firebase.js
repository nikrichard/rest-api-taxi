// Import Admin SDK
var admin = require("firebase-admin");
var serviceAccount = require("../evansuser-93e07-firebase-adminsdk-fdncq-45c6ef2caf.json");

// Mongodb update
var CoordinateDriver = require('../models/coordinatesUser');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://evansuser-93e07.firebaseio.com"
});

// Get a database reference to our posts
var db = admin.database();
//var ref = db.ref("coordenadaUpdate").orderByKey();

// Attach an asynchronous callback to read the data at oura posts reference




/*ref.on("value",  function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    // key will be "ada" the first time and "alan" the second time
    var key = childSnapshot.key;
    // childData will be the actual contents of the child
    var childData = childSnapshot.val();
    
    CoordinateDriver.findOne({'userCreator':key},(err,data)=>{
      if(err) console.log(err)
      if(data){
        data.latitude=childData.lat;
        data.longitude=childData.log;
        data.save((err)=>{
          if(err) console.log(err)
        })
      }
    })

    
    // const drivercoordinate = await CoordinateDriver.findOne({'driverCreator':key})
    
  });
  
}, function(error) {
  console.error(error);
});*/
  

module.exports = {
    db
}