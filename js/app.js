let
  map,
  geoCoder,
  http = new easyhttp();

function initMap() {
  //http.get('https://api.myjson.com/bins/1g6a9j', handleGeoJsonGet);
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 13,
    center: { lat: 33.0846819, lng: -96.5705341 }
  });

  map.data.loadGeoJson('https://api.myjson.com/bins/1g6a9j');

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
    else if (featureName === 'Parker') {
      color = 'orange';
      sWeight = 0;
    }
    else if (featureName === 'Saint Paul') {
      color = 'yellow';
      sWeight = 0;
    }
    else if (featureName === 'Wylie') {
      color = 'magenta';
      sWeight = 0;
    }
    else if (featureName === 'Lowry Crossing') {
      color = 'orange';
      sWeight = 0;
    }
    else {
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

function handleGeoJsonGet(error, response) {
  if (error) {
    console.log(error);
  } else {
    let infoWindow = new google.maps.InfoWindow();
    let latLng     = new google.maps.LatLng(33.0846819, -96.5705341);
        map        = new google.maps.Map(document.getElementById('map-canvas'), {
      center: {
        lat: 33.0846819,
        lng: -96.5705341
      },
      zoom: 13
    });

    geocoder = new google.maps.Geocoder();

    var bounds = new google.maps.LatLngBounds();
    map.data.addListener('addfeature', function (e) {
      if (e.feature.getProperty('name') === 'Lovejoy Independent School District') {
        processPoints(e.feature.getGeometry(), bounds.extend, bounds);
        map.fitBounds(bounds);
      }
    });

    map.data.setStyle(function (feature) {
      var featureName = feature.getProperty('name');
      var color;
      var sColor;
      var sWeight;
      if (featureName === 'McKinney') {
        color   = 'green';
        sWeight = 0;
      } else if (featureName === 'Fairview') {
        color   = 'blue';
        sWeight = 0;
      } else if (featureName === 'Allen') {
        color   = 'yellow';
        sWeight = 0;
      } else if (featureName === 'Lucas') {
        color   = 'red';
        sWeight = 0;
      } else if (featureName === 'Parker') {
        color   = 'orange';
        sWeight = 0;
      } else if (featureName === 'Saint Paul') {
        color   = 'yellow';
        sWeight = 0;
      } else if (featureName === 'Wylie') {
        color   = 'magenta';
        sWeight = 0;
      } else if (featureName === 'Lowry Crossing') {
        color   = 'orange';
        sWeight = 0;
      } else {
        color   = 'transparent';
        sColor  = 'red';
        sWeight = 1;
      }
      return {
        fillColor   : color,
        strokeWeight: sWeight,
        strokeColor : sColor,
        clickable   : false
      };
    });

    map.data.addListener('click', function (event) {
      infoWindow.setContent(event.feature.getProperty('name'));
      infoWindow.setPosition(event.latLng);
      infoWindow.setOptions({
        pixelOffset: new google.maps.Size(0, -34)
      });
      infoWindow.open(map);
    });
    //console.log(response.responseText);
    map.data.addGeoJson(JSON.parse(response));
  }

}

function codeAddress() {
  var address = document.getElementById('tbAddress').value;
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      console.log(results);
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: results[0].formatted_address
      });
    } else {
      swal("Opps!", "Unable to find that address", "error");
    }
  });
}

function addmarker(latilongi, title) {
  var marker = new google.maps.Marker({
    position: latilongi,
    title: title,
    draggable: true,
    map: map
  });
  map.setCenter(marker.getPosition())
}

document.getElementById('btnAddressCheck').addEventListener('click', codeAddress);

function codeAddress(e) {
  const geocoder = new google.maps.Geocoder();
  const address = document.getElementById('tbAddress').value;
  geocoder.geocode({ 'address': address }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      console.log(results);
      map.setCenter(results[0].geometry.location);
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