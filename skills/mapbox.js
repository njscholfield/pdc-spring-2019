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
      'circle-color': ['get', 'color'],
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
      title: escapeHtml(e.currentTarget[0].value),
      description: escapeHtml(e.currentTarget[1].value),
      color: escapeHtml(e.currentTarget[2].value),
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
    // .setText(feature.properties.title)
    .setHTML(`<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`)
    .addTo(map);
});

// Function from http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

let stateJSON;
fetch('states.json')
  .then((response) => response.json())
  .then((data) => stateJSON = data);

const stMap = new mapboxgl.Map({
  container: 'state-map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-98.5795, 39.8384],
  zoom: 3.0
});
stMap.addControl(new mapboxgl.NavigationControl());

stMap.on('load', function() {
  stMap.addLayer({
    id: 'states',
    type: 'fill',
    source: {
      type: 'geojson',
      data: stateJSON,
    },
    paint: {
      'fill-color': {
        property: 'CENSUSAREA',
        stops: [[61, '#fff'], [262000, '#f00']]
      },
      'fill-opacity': 0.7,
      'fill-outline-color': '#333',
    }
  });
});

stMap.on('click', function(e) {
  var features = stMap.queryRenderedFeatures(e.point, {
    layers: ['states']
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];

  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(e.lngLat)
    // .setText(feature.properties.title)
    .setHTML(`<h3>${feature.properties.NAME}</h3><p><strong>Census Area:</strong> ${feature.properties.CENSUSAREA}</p>`)
    .addTo(stMap);
});
