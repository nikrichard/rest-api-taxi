var MapboxClient = require('mapbox');

var client = new MapboxClient('sk.eyJ1Ijoic3VwcG9ydGV2YW5zIiwiYSI6ImNrNGcyM2JnYzB1aXozbW83cWhqZ2l0enMifQ.6qXlLzej2U7OXyRAmX7t0w');
var Direction = require('mapbox/lib/services/directions')
var client2 = new Direction('sk.eyJ1Ijoic3VwcG9ydGV2YW5zIiwiYSI6ImNrNGcyM2JnYzB1aXozbW83cWhqZ2l0enMifQ.6qXlLzej2U7OXyRAmX7t0w');
client.geocodeForward('Chester, NJ', function(err, data, res) {
    // data is the geocoding result as parsed JSON
    // res is the http response, including: status, headers and entity properties
  });

  client.geocodeForward('Chester, NJ')
  .then(function(res) {
    // res is the http response, including: status, headers and entity properties
    var data = res.entity; // data is the geocoding result as parsed JSON
  })
  .catch(function(err) {
    // handle errors
  });

client.getDirections([{
        latitude: -15.838381,
        longitude: -70.022683
    },
    { 
        latitude: -15.844450,
        longitude: -70.018520
    }],
       function(err, res) {
      console.log(res.routes[0].geometry)
     });

