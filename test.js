// Import Admin SDK
var admin = require("firebase-admin");
var serviceAccount = require("./evansuser-93e07-firebase-adminsdk-fdncq-45c6ef2caf.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://evansuser-93e07.firebaseio.com"
  });

// Get a database reference to our posts
var db = admin.database();
var ref = db.ref("settingUser/5e3884978c932b168030ba73");

// Attach an asynchronous callback to read the data at our posts reference

ref.update({accountActivate:false})
// ref.on("value", function(snapshot) {
//   var changedPost = snapshot.val();
//   console.log("Th " + changedPost.lat,changedPost.log);

// }, function (errorObject) {
//   console.log("The read failed: " + errorObject.code);
// });