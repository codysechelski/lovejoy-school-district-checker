let
  map,
  geoCoder,
  originalBounds,
  currentBounds,
  styledFeatures = true,
  styledLisd = true;
  markersArray = [];


//Event Listeners
document.getElementById('btnAddressCheck').addEventListener('click', codeAddress);
document.getElementById('btnClearMarkers').addEventListener('click', clearMarkers);
document.getElementById('btnToggleStyle').addEventListener('click', toggleFeatureStyle);
document.getElementById('btnToggleLisdBounds').addEventListener('click', toggleLisdStyle);
document.getElementById('btnCenterMap').addEventListener('click', centerMap);

//Init Map
function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 13,
    center: { lat: 33.0846819, lng: -96.5705341 }
  });

  map.data.loadGeoJson('https://api.myjson.com/bins/14anrb', undefined, function () {
    map.data.forEach(function (feature) {
      if (feature.f.id === 'lisd') {
        currentBounds =  getPolygonBounds(feature);
        originalBounds = new google.maps.LatLngBounds(currentBounds.getSouthWest(), currentBounds.getNorthEast());
        map.fitBounds(currentBounds);
      }
    });
  });

  styleFeatures();
  styleLisd();
  
  let infowindow = new google.maps.InfoWindow();
  map.data.addListener('click', function (event) {
    infowindow.setContent(event.feature.getProperty('name'));
    infowindow.setPosition(event.latLng);
    infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -34) });
    infowindow.open(map);
  });
}


function codeAddress(e) {
  const geocoder = new google.maps.Geocoder();
  const address = document.getElementById('tbAddress').value;
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      currentBounds.extend(results[0].geometry.location);
      map.fitBounds(currentBounds);
      let marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: results[0].formatted_address
      });
      markersArray.push(marker);
      document.getElementById('tbAddress').value = '';
    } else {
      swal("Opps!", "Unable to find that address", "error");
    }
  });
  e.preventDefault();
}

function getPolygonBounds(feature) {
  const bounds = new google.maps.LatLngBounds();

  feature.getGeometry().getArray().forEach(function (path) {
    path.getArray().forEach(function (latLng) {
      bounds.extend(latLng);
    });
  });

  return bounds;
}



function clearMarkers(){
  markersArray.forEach(function(marker){
    marker.setMap(null);
  });
  map.fitBounds(originalBounds);
}

function styleFeatures(){
  map.data.setStyle(function (feature) {
    const featureId = feature.getProperty('id');
    if (featureId !== 'lisd') {
      return featureStyles[featureId];
    }
    else{
      if (styledLisd) {
        return featureStyles[featureId];
      } else{
        return featureStyles['hidden'];
      }
    }
  });
  styledFeatures = true;
}

function styleLisd(){
  map.data.setStyle(function (feature) {
    const featureId = feature.getProperty('id');
    if (featureId === 'lisd') {
      return featureStyles[featureId];
    }
    else{
      if (styledFeatures) {
        return featureStyles[featureId];
      }
      else{
        return featureStyles['hidden'];
      }
    }
  });
  styledLisd = true;
}

function unstyleFeatures(){
  map.data.setStyle(function (feature) {
    const featureId = feature.getProperty('id');
    if (featureId !== 'lisd') {
      return featureStyles['hidden'];
    }
    else{
      if(styledLisd){
        return featureStyles[featureId];
      } else{
        return featureStyles['hidden'];
      }
    }
  });
  styledFeatures = false;
}


function unstyleLisd(){
  map.data.setStyle(function (feature) {
    const featureId = feature.getProperty('id');
    if (featureId === 'lisd') {
      return featureStyles['hidden'];
    }
    else{
      if (styledFeatures) {
        return featureStyles[featureId];
      }
      else{
        return featureStyles['hidden'];
      }
    }
  });
  styledLisd = false;
}


function toggleFeatureStyle(){
  if (styledFeatures) {
    unstyleFeatures();
  } else {
    styleFeatures();
  }
}

function toggleLisdStyle(){
  if (styledLisd) {
    unstyleLisd();
  } else {
    styleLisd();
  }
}

function centerMap(){
  map.fitBounds(originalBounds);
}

const featureStyles = {
  wylie : {
    fillColor   : 'magenta',
    strokeColor : 'transparent',
    strokeWeight: 0,
    clickable   : false
  },
  mckinney : {
    fillColor   : 'green',
    strokeColor : 'transparent',
    strokeWeight: 0,
    clickable   : false
  },
  fairview : {
    fillColor   : 'blue',
    strokeColor : 'transparent',
    strokeWeight: 0,
    clickable   : false
  },
  allen : {
    fillColor   : 'yellow',
    strokeColor : 'transparent',
    strokeWeight: 0,
    clickable   : false
  },
  lucas : {
    fillColor   : 'red',
    strokeColor : 'transparent',
    strokeWeight: 0,
    clickable   : false
  },
  lisd : {
    fillColor   : 'transparent',
    strokeColor : 'red',
    strokeWeight: 1,
    clickable   : false
  },
  hidden : {
    fillColor   : 'transparent',
    strokeColor : 'transparent',
    strokeWeight: 0,
    clickable   : false
  }
}