let
  map,
  geoCoder,
  lisdFeature,
  originalBounds,
  currentBounds,
  styledFeatures = true,
  styledLisd = true,
  markersArray = [],
  infoWindowArray = [],
  legendItems = [],
  legend = document.getElementById('legend');


//Event Listeners
document.getElementById('btnAddressCheck').addEventListener('click', codeAddress);
document.getElementById('btnClearMarkers').addEventListener('click', clearMarkers);
document.getElementById('btnToggleStyle').addEventListener('click', toggleFeatureStyle);
document.getElementById('btnToggleLisdBounds').addEventListener('click', toggleLisdStyle);
document.getElementById('btnCenterMap').addEventListener('click', centerMap);

document.getElementById('btnAddressCheckSm').addEventListener('click', codeAddress);
document.getElementById('btnClearMarkersSm').addEventListener('click', clearMarkers);
document.getElementById('btnToggleStyleSm').addEventListener('click', toggleFeatureStyle);
document.getElementById('btnToggleLisdBoundsSm').addEventListener('click', toggleLisdStyle);
document.getElementById('btnCenterMapSm').addEventListener('click', centerMap);

/**
 * Geocodes an address query and creates
 * a map marker
 * 
 * @param string e 
 */
function codeAddress(e) {
  const geocoder = new google.maps.Geocoder();
  const address = document.getElementById('tbAddress').value;
  geocoder.geocode({
    'address': address
  }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      currentBounds.extend(results[0].geometry.location);
      map.fitBounds(currentBounds);
      const marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: results[0].formatted_address
      });

      const inLisdStr = isInLisd(results[0]) ?
        '<div class="alert alert-success p-2"><i class="far fa-thumbs-up"></i> Yes, this address in in LISD</div>' :
        '<div class="alert alert-danger p-2"><i class="far fa-thumbs-down"></i> No, this address in not in LISD</div>';
      let infoWindow = new google.maps.InfoWindow({
        content: `
          <h6>${results[0].formatted_address}</h6>
           ${inLisdStr}
        `,
        maxWidth: 260
      });
      infoWindowArray.forEach(function (infoWin) {
        infoWin.close();
      });
      infoWindowArray.push(infoWindow);
      infoWindow.open(map, marker);
      marker.addListener('click', function () {
        infoWindowArray.forEach(function (infoWin) {
          infoWin.close();
        });
        infoWindow.open(map, marker);
      });

      
      markersArray.push(marker);
      document.getElementById('tbAddress').value = '';
    } else {
      swal("Opps!", "Unable to find that address", "error");
    }
  });
  e.preventDefault();
}

function isInLisd(place) {
  const point = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
  const pathArray = [];

  lisdFeature.getGeometry().getArray().forEach(function (path) {
    path.getArray().forEach(function (latLng) {
      pathArray.push(latLng);
    });
  });
  
  const poly = new google.maps.Polygon({
    paths: pathArray
  });

  return google.maps.geometry.poly.containsLocation(point, poly);
}

/**
 * Creates a LatLngBounds object
 * from a polygon
 * 
 * @param {any} feature 
 * @returns 
 */
function getPolygonBounds(feature) {
  const bounds = new google.maps.LatLngBounds();

  feature.getGeometry().getArray().forEach(function (path) {
    path.getArray().forEach(function (latLng) {
      bounds.extend(latLng);
    });
  });

  return bounds;
}


/**
 * Clears all markers on the map
 * 
 */
function clearMarkers() {
  markersArray.forEach(function (marker) {
    marker.setMap(null);
  });
  map.fitBounds(originalBounds);
  currentBounds = originalBounds;
}


function toggleFeatureStyle() {
  if (styledFeatures) {
    unstyleFeatures();
  } else {
    styleFeatures();
  }
}

function toggleLisdStyle() {
  if (styledLisd) {
    unstyleLisd();
  } else {
    styleLisd();
  }
}

function centerMap() {
  map.fitBounds(originalBounds);
}


/**
 * Adds a style to the city boundaries
 * 
 */
function styleFeatures() {
  map.data.setStyle(function (feature) {
    const featureId = feature.getProperty('id');
    if (featureId !== 'lisd') {
      return featureStyles[featureId];
    } else {
      if (styledLisd) {
        return featureStyles[featureId];
      } else {
        return featureStyles['hidden'];
      }
    }
  });
  styledFeatures = true;
  buildLegend();
}


/**
 * Adds a style to the LISD boundaries
 * 
 */
function styleLisd() {
  map.data.setStyle(function (feature) {
    const featureId = feature.getProperty('id');
    if (featureId === 'lisd') {
      return featureStyles[featureId];
    } else {
      if (styledFeatures) {
        return featureStyles[featureId];
      } else {
        return featureStyles['hidden'];
      }
    }
  });
  styledLisd = true;
  buildLegend();
}


/**
 * Removes the styles from city boundaries
 * 
 */
function unstyleFeatures() {
  map.data.setStyle(function (feature) {
    const featureId = feature.getProperty('id');
    if (featureId !== 'lisd') {
      return featureStyles['hidden'];
    } else {
      if (styledLisd) {
        return featureStyles[featureId];
      } else {
        return featureStyles['hidden'];
      }
    }
  });
  styledFeatures = false;
  buildLegend();
}


/**
 * Removes the style from the LISD boundaries
 * 
 */
function unstyleLisd() {
  map.data.setStyle(function (feature) {
    const featureId = feature.getProperty('id');
    if (featureId === 'lisd') {
      return featureStyles['hidden'];
    } else {
      if (styledFeatures) {
        return featureStyles[featureId];
      } else {
        return featureStyles['hidden'];
      }
    }
  });
  styledLisd = false;
  buildLegend();
}

function buildLegend() {
  let lis = '';
  if (styledFeatures || styledLisd) {
    if (map.controls[google.maps.ControlPosition.LEFT_BOTTOM].length === 0) {
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
    }
    legendItems.forEach(function (item) {
      if (item.isCity && styledFeatures) {
        lis += `<li>
                <span class="legend-swatch legend-swatch-city"
                  style="background:${featureStyles[item.id].fillColor}; border:solid 1px ${featureStyles[item.id].strokeColor};"></span>
                ${item.name}
              </li>`;
      }
      if (item.isLisd && styledLisd) {
        lis += `<li>
                <span class="legend-swatch legend-swatch-lisd"
                  style="background:${featureStyles[item.id].fillColor}; border:solid 1px ${featureStyles[item.id].strokeColor};"></span>
                Lovejoy ISD
              </li>`;
      }
      document.querySelector('#legend ul').innerHTML = lis;
      
    });
  } else {
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].clear();
  }
  
}


//Init Map
function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 13,
    center: {
      lat: 33.0846819,
      lng: -96.5705341
    }
  });

  map.data.loadGeoJson('https://api.myjson.com/bins/14anrb', undefined, function () {
    map.data.forEach(function (feature) {
      if (feature.f.id === 'lisd') {
        lisdFeature = feature;
        currentBounds = getPolygonBounds(feature);
        console.log('currentBounds', currentBounds);
        console.log('setting original bounds');
        
        originalBounds = new google.maps.LatLngBounds(currentBounds.getSouthWest(), currentBounds.getNorthEast());
        console.log('originalBounds', originalBounds);
        
        map.fitBounds(currentBounds);
      }
      legendItems.push({
        id: feature.f.id,
        name: feature.f.name,
        isLisd: feature.f.id === 'lisd',
        isCity: feature.f.id !== 'lisd'
      });
    });
    buildLegend();
  });

  styleFeatures();
  styleLisd();
  
}