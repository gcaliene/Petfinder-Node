$(document).ready(function() {
  // console.log(username);
  // console.log(password);

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
        console.log(data);
        window.location = 'index.html';
        alert(`You are registered with ${data.username}, please login.`);
      },
      error: function(error) {
        //console.log({ error });

        alert(
          `${error.status} error at ${error.responseJSON.location}: "${
            error.responseJSON.message
          }".`
        );
      }
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
        console.log({ error });
        alert(
          `${error.status} error: ${
            error.responseText
          }. Please check your Username and Password.`
        );
      }
    });
  });
});
