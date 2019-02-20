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

const allConditions = []; // array to hold all conditions for easy resetting
let conditionsToShow = []; // array to hold the conditions to be shown on the map

function filterByCondition(e) {
  const btn = e.currentTarget;
  const condition = btn.dataset.condition;
  if(btn.classList.contains('active')) {
    const index = conditionsToShow.lastIndexOf(condition); // find the condition in the array
    conditionsToShow.splice(index, 1); // remove that condtion
    btn.classList.remove('active');
  } else {
    btn.classList.add('active');
    conditionsToShow.push(condition);
  }
  const filter = ['match', ['get', 'condition'], conditionsToShow, true, false];
  map1.setFilter('tree-heatmap', filter);
  map1.setFilter('tree-dots', filter);
}
const filterBtns = [...document.querySelectorAll('#filter-buttons button')];
filterBtns.forEach((btn) => {
  btn.addEventListener('click', filterByCondition);
  allConditions.push(btn.dataset.condition);
});
conditionsToShow = allConditions.slice(); // copy all conditions into conditionToShow to start

// Function that resets the filter to default
function filterReset() {
  for(const btn of filterBtns) {
    btn.classList.add('active');
  }
  conditionsToShow = allConditions.slice(); // reset conditionToShow
  const filter = ['match', ['get', 'condition'], conditionsToShow, true, false];
  map1.setFilter('tree-heatmap', filter);
  map1.setFilter('tree-dots', filter);
}
document.getElementById('filter-reset').addEventListener('click', filterReset);

function toggleHeatmap() {
  const visibility = map1.getLayoutProperty('tree-heatmap', 'visibility');
  const [newVisibility, newBtnText] = (visibility === 'visible') ? ['none', 'Show Heatmap'] : ['visible', 'Hide Heatmap'];
  map1.setLayoutProperty('tree-heatmap', 'visibility', newVisibility);
  document.getElementById('toggle-heatmap').innerHTML = newBtnText;
}
document.getElementById('toggle-heatmap').addEventListener('click', toggleHeatmap);
