// Here is the javascript setup for a basic map:

// Enter your mapbox map id here to reference it for the base layer,
// this one references the ugly green map that I made.
var mapId = 'tinacormier.019h3jej';

// And this is my access token, use yours.
var accessToken = 'pk.eyJ1IjoidGluYWNvcm1pZXIiLCJhIjoiY2lucHozdW03MTAzNXR0bTMwcmZ6eWZzayJ9.y4GzGC6WEC3JBskj9s2v0A';

// Create the map object with your mapId and token,
// referencing the DOM element where you want the map to go.
L.mapbox.accessToken = accessToken;
var map = L.mapbox.map('map', mapId);

// Set the initial view of the map to the whole US
map.setView([39, -96], 4);

// Great, now we have a basic web map!

// Set ref to data we want to use (single quotes for strings to you can use double quotes inside them later).
var dataFileToAdd = 'data/restaurants.geojson';

// Create a feature layer using constructor function that is empty for now - like a shapefile on desktop gis
var featureLayer = L.mapbox.featureLayer();
	// Load data
	featureLayer.loadURL(dataFileToAdd);
	// Add it to the  map
	featureLayer.addTo(map);
// Stying - using ".on" is a listener called "ready" that is set once above stuff is loaded - 
// Feature layer object type emits an event or status after it digests what we've called above 
// associated with that layer (can be digesting multiple layers at once)
featureLayer.on('ready', function(){
  this.eachLayer(function(layer){
  	// Mapbox/leaflet constructs
    layer.setIcon(L.mapbox.marker.icon({
      "marker-color": "#8834bb",
      "marker-size": "large",
      "marker-symbol": "restaurant"
    }))
 })
    map.fitBounds(featureLayer.getBounds());
})
// Add pop ups
// featureLayer.on('ready', function(){
//	this.eachLayer(function(layer){
//    	layer.bindPopup('Welcome to ' + layer.feature.properties.name);
//    })                
// })

// Nah, how about a sidebar instead!
// Write a function called a click handler - gets called when you click on a point.
// 'e' in the fucntion consumes "event" of clicking. It will have our target element and geoJSON features
var clickHandler = function(e){ 
  // empty the div we are going to play with (in case we have clicked it before - need to empty what's there).
  // So we need to empty the 'info' dive within sidebar (see index.html)
  // using jquery (i.e. the .empty) - can ref query by passing in a selector (look up #'s .'s etc.).
  $('#info').empty();
  
  // get the info from the point you click on.
  var feature = e.target.feature;
  
  // fade in is in milliseconds
  $('#sidebar').fadeIn(400, function(){
  	var info = '';
    
    // take variable and apped something into it is the +=
    // <p> is paragraph <a> is link.
    info += '<div>';
    info += '<h2>' + feature.properties.name + '</h2>';
    // If these properties exist, add them.
    if(feature.properties.cuisine) info += '<p>' + feature.properties.cuisine + '</p>';
    if(feature.properties.phone) info += '<p>' + feature.properties.phone + '</p>';
    if(feature.properties.website) {
    	info += '<p><a href="' + feature.properties.website + '">' + feature.properties.website + '</a></p>';
    }
    info += '</div>';
    // now append info
    $('#info').append(info)
  })
  
  // Access current location
  var = myGeoJSON = myLocation.getGeoJSON();
  
  // Call function that is actually written below.
  getDirections(myGeoJSON.geometry.coordinates, feature.geomtery.coordinates);
  
} // end click handler

featureLayer.on('ready', function() {
	this.eachLayer(function(layer) {
    	layer.on('click', clickHandler)
    })
})

map.on('click', function(){
	$('#sidebar').fadeOut(200);	
  
})

// What if we want to show the user where THEY are in relation to the restuarant.
// Browsers have capability to get location of the device and share with js
// First, create a new, blank feature layer that holds our location and add to map (chaining commands together)
var myLocation = L.mapbox.featureLayer().addTo(map);

// Listener for event 'locationfound'
map.on('locationfound', function(e) {
	myLocation.setGeoJSON({
      	// set up geoJSON 
    	type: 'Feature',
      	geometry: {
          type: 'Point',
          // flat array (x,y)
          coordinates: [ e.latlng.lng, e.latlng.lat ]
    	}, 
      	properties: {
       		"title": "Here I am!", 
          	"marker-color": "#ff8888",
          	"marker-symbol": "star"
        }
      
    })
})

// Now get our location
map.locate({setView: true})

// Directions! Integrate w/ 3rd party turn-by-turn directions group. Using mapzen - which uses OSM. Check out their docs (in exercise 9).
// Start w/ blank feature layer again.
var routeLine = L.mapbox.featureLayer().addTo(map);

// Need function to take from point and to point and call their service
function getDirections(frm,to) {
  	var jsonPayload = JSON.stringify({
    	locations: [
          {lat: frm[1], lon: frm[0]},
          {lat: to[1], lon: to[0]}
        ],
      	// tell it how to prioritize routes
      	costing: 'pedestrian',
      	units: 'miles'
    })
    
    // now need a way to call the service. Since we are using jquery (access it using $).
    $.ajax({
    	url: 'http://valhalla.mapzen.com/route',
      	data: {
          	json: jsonPayLoad,
          	// Need to get your own key after this workshop. Go to the website and authenticate w/ github.
          	api_key: 'valhalla-gwtf3x2'
        }
    }).done(function(data){
    	var routeShape = polyline.decode(data.trip.legs[0].shape):
        routeLine.setGeoJSON({
          	type: 'Feature',
          	geometry: {
            	type: 'LineString',
              	coordinates: routeShape
            },
          	properties: {
              	// Mapbox simple style spec.
            	"stroke": "#ed23f1",
              	"stroke-opacity": 0.8,
             	"stroke-width": 8
            }
        
        })
    })
  
}