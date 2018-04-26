let
  map,
  geoCoder,
  currentBounds;

function initMap() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 13,
    center: { lat: 33.0846819, lng: -96.5705341 }
  });

  map.data.loadGeoJson('https://api.myjson.com/bins/14anrb', undefined, function () {
    map.data.forEach(function (feature) {
      if (feature.f.id === 'lisd') {
        currentBounds = getPolygonBounds(feature);
        map.fitBounds(currentBounds);
      }
    });
  });

  map.data.setStyle(function (feature) {
    var featureName = feature.getProperty('name');
    var color;
    var sColor;
    var sWeight;
    if (featureName === 'McKinney') {
      color = 'green';
      sWeight = 0;
    }
    else if (featureName === 'Fairview') {
      color = 'blue';
      sWeight = 0;
    }
    else if (featureName === 'Allen') {
      color = 'yellow';
      sWeight = 0;
    }
    else if (featureName === 'Lucas') {
      color = 'red';
      sWeight = 0;
    }
    else if (featureName === 'Wylie') {
      color = 'magenta';
      sWeight = 0;
    }
    else if (featureName === 'Lovejoy Independent School District') {
      color = 'transparent';
      sColor = 'red';
      sWeight = 1;
    }
    return {
      fillColor: color,
      strokeWeight: sWeight,
      strokeColor: sColor,
      clickable: false
    };
  });

  let infowindow = new google.maps.InfoWindow();
  map.data.addListener('click', function (event) {
    infowindow.setContent(event.feature.getProperty('name'));
    infowindow.setPosition(event.latLng);
    infowindow.setOptions({ pixelOffset: new google.maps.Size(0, -34) });
    infowindow.open(map);
  });
}


document.getElementById('btnAddressCheck').addEventListener('click', codeAddress);

function codeAddress(e) {
  const geocoder = new google.maps.Geocoder();
  const address = document.getElementById('tbAddress').value;
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      console.log(results);
      currentBounds.extend(results[0].geometry.location);
      map.fitBounds(currentBounds);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: results[0].formatted_address
      });
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