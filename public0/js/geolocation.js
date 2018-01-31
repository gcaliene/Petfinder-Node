var x = document.getElementById('demo');

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = 'Geolocation is not supported by this browser.';
  }
}

function showPosition(position) {
  // console.log(position);
  const latlon = position.coords.latitude + ',' + position.coords.longitude;
  const googleMapsUrl = `https://www.google.com/maps/@${latlon}`;
  // const googleMapsUrlMongo = `<a href='${googleMapsUrl}'>Map</a>`;

  // const img_url =
  //   'https://maps.googleapis.com/maps/api/staticmap?center=' +
  //   latlon +
  //   '&zoom=14&size=400x300&key=AIzaSyC-09EwnS5ttNn7X-JdM0c7OluJ4I89mpE';
  // document.getElementById('mapholder').innerHTML =
  //   "<img src='" + img_url + "'>";
  // console.log(googleMapsUrlMongo);
  getReverseGeocode(latlon, googleMapsUrl);

  //window.open(googleMapsUrl, '_blank');
}

function getReverseGeocode(latlon, googleMapsUrl) {
  $.ajax({
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlon}&key=AIzaSyC-09EwnS5ttNn7X-JdM0c7OluJ4I89mpE`,
    dataType: 'text',
    success: function(jsonString) {
      // console.log('getReverseGeocode ran');
      let jsonObject = $.parseJSON(jsonString);
      // console.log(jsonObject.results[0].address_components);
      // console.log(jsonObject.results[0].address_components[0]);
      const googleArrayObject = jsonObject.results[0].address_components;
      const googleArrayLength = jsonObject.results[0].address_components.length;
      // console.log(googleArrayLength);
      let cityName = '';
      for (let i = 0; i < googleArrayLength; i++) {
        if (googleArrayObject[i].types[0] === 'locality') {
          // console.log(googleArrayObject[i].long_name);
          $('#js-post-city').html(googleArrayObject[i].long_name);
          $('#map_url').html(googleMapsUrl);
          console.log(googleMapsUrl);
        }
      }
    }
  });
}

// function showPosition(position) {
//   x.innerHTML =
//     'Latitude: ' +
//     position.coords.latitude +
//     '<br>Longitude: ' +
//     position.coords.longitude;
// }

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = 'User denied the request for Geolocation.';
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = 'Location information is unavailable.';
      break;
    case error.TIMEOUT:
      x.innerHTML = 'The request to get user location timed out.';
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = 'An unknown error occurred.';
      break;
  }
}
