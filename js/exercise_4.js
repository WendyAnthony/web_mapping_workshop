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

featureLayer.on('ready', function(){
	this.eachLayer(function(layer){
    	layer.bindPopup('Welcome to ' + layer.feature.properties.name);
    })
                   
 })