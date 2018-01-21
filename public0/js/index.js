$(document).ready(function() {
  const token = localStorage.getItem('token');
  if (token !== null) {
    // window.location.replace("/app.html");

    $('#nav-registerlogin').addClass('hidden');
    $('#registration-login').addClass('hidden');
    $('#nav-login').addClass('hidden');
    $('#header-register-button').addClass('hidden');
    $('#header-login-button').addClass('hidden');
  } else {
    $('#nav-logout').addClass('hidden');
  }

  $('#nav-logout').on('click', function() {
    localStorage.removeItem('token');
    window.location = '/';
  });

  $('#register').on('click', function(event, username, password) {
    var username = $('#username').val();
    var password = $('#password').val();
    event.preventDefault();
    var json = JSON.stringify({ username, password });
    //console.log(json);
    $.ajax({
      type: 'POST',
      url: '/api/users',
      contentType: 'application/json',
      data: json,
      success: function(data) {
        // console.log(data);
        $('#error-username-login').html('');
        $('#error-password-registration').html('');
        $('#error-username-registration').html('');
        $('#username').val('');
        $('#password').val('');
        $('#error-username-login').removeClass(
          'class-error-username-registration'
        );
        $('#error-username-login').addClass('class-success-username-login');
        $('#success-username-login').removeClass('hidden');
        $('#success-username-login').append(
          `Registration Success! Please Login Below.`
        );
      },
      error: function(error) {
        if (error.responseJSON.location === 'password') {
          $('#error-username-login').html('');
          $('#error-password-registration').html('');
          $('#error-username-registration').html('');
          $('#error-password-registration').removeClass('hidden');
          $('#error-password-registration').append(
            `${error.responseJSON.location.toUpperCase()}: ${
              error.responseJSON.message
            }`
          );
        } else {
          $('#error-username-login').html('');
          $('#error-password-registration').html('');
          $('#error-username-registration').html('');
          $('#error-username-registration').removeClass('hidden');
          $('#error-username-registration').append(
            `${error.responseJSON.location.toUpperCase()}: ${
              error.responseJSON.message
            }`
          );
        }
      }
      // alert(
      //   `${error.status} error at ${error.responseJSON.location}: "${
      //     error.responseJSON.message
      //   }".`
      // );
    });
  });

  $('#login').on('click', function(event, username, password) {
    var username = $('#username-login').val();
    var password = $('#password-login').val();
    event.preventDefault();
    var json = JSON.stringify({ username, password });
    //console.log(json);
    $.ajax({
      type: 'POST',
      url: '/api/auth/login',
      // headers: {
      //   Authorization: `Bearer ${data.authToken}`
      // },
      contentType: 'application/json',
      data: json,
      success: function(data, textStatus, request) {
        // request.setRequestHeader('Authorization', `Bearer ${data.authToken}`);
        console.log(data);

        localStorage.setItem('token', data.authToken);
        // response.setHeader('Authorization', data.authToken);

        window.location = '/app.html';
      },
      error: function(error) {
        $('#error-password-registration').html('');
        $('#error-username-registration').html('');
        $('#error-username-login').html('');
        $('#error-username-login').removeClass('hidden');
        $('#error-username-login').removeClass('class-success-username-login');
        $('#error-username-login').addClass(
          'class-error-username-registration'
        );
        $('#error-username-login').append(
          `Please Check Your Username and Password`
        );
        // console.log({ error });
        // alert(
        //   `${error.status} error: ${
        //     error.responseText
        //   }. Please check your Username and Password.`
        // );
      }
    });
  });
});
