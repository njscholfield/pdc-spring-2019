/* global mapboxgl, MapboxGeocoder */
mapboxgl.accessToken = 'pk.eyJ1IjoibmpzY2hvbGZpZWxkIiwiYSI6ImNqcmN0ZTZyNzFnM2M0M3A4OTE3dnc2bWIifQ.RXPCNEAOoAl-Aldh-iuEeQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-79.984326, 40.441071],
  zoom: 14.0
});


map.addControl(new MapboxGeocoder({
  accessToken: mapboxgl.accessToken
}));
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
      data: {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [-77.03238901390978, 38.913188059745586]
          },
          'properties': {
            'title': 'Mapbox DC',
            'icon': 'monument'
          }
        }, {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [-122.414, 37.776]
          },
          'properties': {
            'title': 'Mapbox SF',
            'icon': 'harbor'
          }
        }]
      }
    }
  });
});
