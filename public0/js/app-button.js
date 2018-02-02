$(document).ready(function() {
  if ($('#map_url').val().length === 0) {
    $('#submit').attr('disabled', 'disabled');
  }
  $('#js-get-location').on('click', function() {
    $('#js-get-location').attr('disabled', 'disabled');
    $('html').css('cursor', 'wait');

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
      }
    }, 650);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
      }
    }, 1050);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
      }
    }, 1550);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
      }
    }, 2550);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
      }
    }, 4550);

    setTimeout(function() {
      if ($('#map_url').val().length === 0) {
        alert('Sorry, geolocationservers are taking too long to reply.');
      }
    }, 10000);
  });
  $('#submit').on('click', function() {
    // $('#submit').attr('disabled', 'disabled');
    $('#js-get-location').removeAttr('disabled');
  });
});
