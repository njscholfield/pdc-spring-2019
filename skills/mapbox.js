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

let modal = document.querySelector('.modal-backdrop');
let geometry = [];

geocoder.on('result', function(e) {
  modal.classList.remove('d-none');
  document.querySelector('input[name="title"]').focus();
  geometry = e.result.geometry;
});

function addPoint(e) {
  e.preventDefault();
  modal.classList.add('d-none');
  const feature = {
    type: 'Feature',
    properties: {
      title: e.currentTarget[0].value,
    },
    geometry,
  };
  points.features.push(feature);
  map.getSource('points').setData(points);
  localStorage.setItem('points', JSON.stringify(points.features));
}
document.querySelector('.modal-backdrop form').addEventListener('submit', addPoint);

document.getElementById('js-clear').addEventListener('click', function() {
  points.features = [];
  map.getSource('points').setData(points);
  localStorage.setItem('points', JSON.stringify([]));
});

function closeModal() {
  document.querySelector('.modal-backdrop').classList.add('d-none');
}
for (const el of document.getElementsByClassName('mdl-close')) {
  el.addEventListener('click', closeModal);
}

map.on('click', function(e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['points']
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];

  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setText(feature.properties.title)
    .addTo(map);
});
