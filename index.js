import 'ol/ol.css';
import {fromLonLat} from 'ol/proj';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import KML from 'ol/format/KML';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';

const postcode_data = {
  "BS6":"Greensleeves",
  "SM1":"Teddy Bears' Picnic",
  "GU7": "Colonel Bogey",
  "CV1": "Cornetto song",
  "NW1": "Football Crazy",
  "SE16": "Yankee Doodle Dandy",
  "BS41": "Cornetto song, Greensleeves",
  "BS2": "Match of the Day",
  "WA14": "You are my sunshine",
  "BA2": "Cornetto song",
  "DA18": "Yankee Doodle Dandy",
  "BS3": "Cornetto song",
  "NE24": "Nelly the Elephant",
  "BS3": "Greensleeves",
  "SL7": "Teddy Bears' Picnic",
  "OL9": "Teddy Bears' Picnic, Greensleeves",
  "BL1": "Match of the day",
  "BS32": "Batman",
  "N22": "Yankee Doodle Dandy",
  "S1": "The Good The Bad The Ugly",
  "BS3": "A Team"
}


var styleCache = {};

var styleFunction = function (feature) {
  var name = feature.get('name');
  var p = postcode_data[name];
  var colour;
  if(p){
    console.log(p);
    colour = 'rgba(0, 0, 255, 1)';
  }

  var style = null;
  if(p){
    return new Style({
        text: new Text({
            text: '🍦',
            scale: 5
        })
    });
  }
  return null;
};


var vector = new VectorLayer({
  source: new VectorSource({
    url: 'postcodes.kml',
    format: new KML({
      extractStyles: false,
    }),
  }),
  style: styleFunction,
});


var info = $('#info');
info.tooltip({
  animation: false,
  trigger: 'manual',
});


var displayFeatureInfo = function (pixel) {
  info.css({
    left: pixel[0] + 'px',
    top: pixel[1] - 15 + 'px',
  });
  var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
    return feature;
  });
  if (feature) {
    var f = feature.get('name');
    var p = postcode_data[f];
    if(p){
      f = f + " "+p;
    }
    info.attr('data-original-title', f).tooltip('show');
  } else {
    info.tooltip('hide');
  }
};


const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),vector
  ],
  view: new View({
    center: fromLonLat([-3.0, 54.0]),
    zoom: 6
  }) 
});

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    info.tooltip('hide');
    return;
  }
  displayFeatureInfo(map.getEventPixel(evt.originalEvent));
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel);
});

