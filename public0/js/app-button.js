$(document).ready(function() {
  $('#js-get-location').on('click', function() {
    $('#js-get-location').attr('disabled', 'disabled');
    $('html').css('cursor', 'wait');

    setTimeout(function() {
      $('#submit').removeAttr('disabled');
      $('html').css('cursor', 'default');
    }, 1800);
  });
  $('#submit').on('click', function() {
    $('#submit').attr('disabled', 'disabled');
    $('#js-get-location').removeAttr('disabled');
  });
});
