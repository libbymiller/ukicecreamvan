import 'ol/ol.css';
import {fromLonLat} from 'ol/proj';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import KML from 'ol/format/KML';
import {Circle as CircleStyle, Fill, Stroke, Style, Text} from 'ol/style';

let postcode_data = null;
const url = "./data.json";

fetch(url)
  .then(response => response.json())
  .then(data => postcode_data = data);

var styleCache = {};

var styleFunction = function (feature) {
  var name = feature.get('name');
  var p = postcode_data[name];
  var colour;
  if(p){
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

