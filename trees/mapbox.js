/* global mapboxgl */
/* eslint no-unused-vars: 0 */
mapboxgl.accessToken = 'pk.eyJ1IjoibmpzY2hvbGZpZWxkIiwiYSI6ImNqcmN0ZTZyNzFnM2M0M3A4OTE3dnc2bWIifQ.RXPCNEAOoAl-Aldh-iuEeQ';
const map1 = new mapboxgl.Map({
  container: 'heatmap',
  style: 'mapbox://styles/njscholfield/cjream41060ct2smdgyccyvra',
  center: [-79.984326, 40.441071],
  zoom: 14.0
});

map1.addControl(new mapboxgl.NavigationControl());
map1.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}));

map1.on('click', function(e) {
  var features = map1.queryRenderedFeatures(e.point, {
    layers: ['tree-dots']
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];
  var props = feature.properties;
  var benefits = (props.overall_benefits_dollar_value) ? `$${Math.round(props.overall_benefits_dollar_value)}` : 'N/A';

  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(`<h3>${props.common_name}</h3><p><strong>Condition:</strong> ${props.condition}</p><p><strong>Diameter:</strong> ${props.diameter_base_height}</p><p><strong>Overall Value:</strong> ${benefits}</p>`)
    .setLngLat(feature.geometry.coordinates)
    .addTo(map1);
});
/*
const map2 = new mapboxgl.Map({
  container: 'healthmap',
  style: 'mapbox://styles/njscholfield/cjrgw8f1x23yp2sl7qycx50oy',
  center: [-79.984326, 40.441071],
  zoom: 14.0
});

map2.addControl(new mapboxgl.NavigationControl());
map2.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}));

map2.on('click', function(e) {
  var features = map2.queryRenderedFeatures(e.point, {
    layers: ['tree-dots']
  });

  if (!features.length) {
    return;
  }

  var feature = features[0];
  var props = feature.properties;
  var benefits = (props.overall_benefits_dollar_value) ? `$${Math.round(props.overall_benefits_dollar_value)}` : 'N/A';

  var popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(feature.geometry.coordinates)
    .setHTML(`<h3>${props.common_name}</h3><p><strong>Condition:</strong> ${props.condition}</p><p><strong>Diameter:</strong> ${props.diameter_base_height}</p><p><strong>Overall Value:</strong> ${benefits}</p>`)
    .setLngLat(feature.geometry.coordinates)
    .addTo(map2);
});
*/
