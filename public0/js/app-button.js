$(document).ready(function() {
  if ($('#map_url').val().length === 0) {
    $('#submit').attr('disabled', 'disabled');
  }
  $('#js-get-location').on('click', function() {
    $('#js-location-label').removeClass('hidden');
    $('#js-submit-label').addClass('hidden');
    $('#js-get-location').attr('disabled', 'disabled');
    $('html').css('cursor', 'wait');

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
        $('#js-location-label').addClass('hidden');
        $('#js-submit-label-success').removeClass('hidden');
      }
    }, 650);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
        $('#js-location-label').addClass('hidden');
        $('#js-submit-label-success').removeClass('hidden');
      }
    }, 1050);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
        $('#js-location-label').addClass('hidden');
        $('#js-submit-label-success').removeClass('hidden');
      }
    }, 1550);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
        $('#js-location-label').addClass('hidden');
        $('#js-submit-label-success').removeClass('hidden');
      }
    }, 2550);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
        $('#js-location-label').addClass('hidden');
        $('#js-submit-label-success').removeClass('hidden');
      }
    }, 4550);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
        $('#js-location-label').addClass('hidden');
        $('#js-submit-label-success').removeClass('hidden');
      }
    }, 9999);

    setTimeout(function() {
      if ($('#map_url').val().length !== 0) {
        $('#submit').removeAttr('disabled');
        $('html').css('cursor', 'default');
        $('#js-location-label').addClass('hidden');
        $('#js-submit-label-success').removeClass('hidden');
      }
    }, 14999);

    setTimeout(function() {
      if ($('#map_url').val().length === 0) {
        // alert('Sorry, geolocationservers are taking too long to reply.');
        $('#js-location-label-error').removeClass('hidden');
        $('#js-location-label').addClass('hidden');
      }
    }, 15000);
  });
  $('#submit').on('click', function() {
    // $('#submit').attr('disabled', 'disabled');
    $('#js-get-location').removeAttr('disabled');
  });
});
