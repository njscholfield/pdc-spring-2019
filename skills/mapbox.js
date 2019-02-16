/* global mapboxgl, MapboxGeocoder */
mapboxgl.accessToken = 'pk.eyJ1IjoibmpzY2hvbGZpZWxkIiwiYSI6ImNqcmN0ZTZyNzFnM2M0M3A4OTE3dnc2bWIifQ.RXPCNEAOoAl-Aldh-iuEeQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-79.984326, 40.441071],
  zoom: 14.0
});

let points = {
  type: 'FeatureCollection',
  features: [],
};

let savedPoints = localStorage.getItem('points');
if(savedPoints) {
  points.features = JSON.parse(savedPoints);
}

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken
});

map.addControl(geocoder);
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}));

map.on('load', function() {
  map.addLayer({
    id: 'points',
    type: 'circle',
    source: {
      type: 'geojson',
      data: points,
    },
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cba',
    }
  });
});

geocoder.on('result', function(e) {
  const feature = {
    type: 'Feature',
    geometry: e.result.geometry
  };
  points.features.push(feature);
  map.getSource('points').setData(points);
  localStorage.setItem('points', JSON.stringify(points.features));
});

document.getElementById('js-clear').addEventListener('click', function() {
  points.features = [];
  map.getSource('points').setData(points);
  localStorage.setItem('points', JSON.stringify([]));
});
