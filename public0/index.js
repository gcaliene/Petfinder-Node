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
      success: function(req, res) {
        //console.log(req);
        window.location = 'app.html';
        alert(`You are registered with ${req.username}, please login.`);
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
      contentType: 'application/json',
      data: json,
      success: function(req, res) {
        console.log(req.authToken);
        console.log(res);
        // window.location = 'index.html';
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
