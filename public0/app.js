//this is where the front end javascript code goes
/////
window.onload = function(req, res) {
  console.log(req.currentTarget.localStorage.token);
  const token = req.currentTarget.localStorage.token;
  $.ajax({
    type: 'GET',
    headers: {
      Authorization: `${req.currentTarget.localStorage.token}`
    },
    url: '/app.html'
  }).done(function(response) {
    res.render(response);
  });
};
/////

$(function() {
  var $posts = $('#posts');
  var $text = $('#text');
  var $name = $('#name');

  ///////////////////GET///////////////////////////
  $.ajax({
    type: 'GET',
    url: '/posts',
    success: function(posts) {
      $.each(posts, function(index, post) {
        // console.log(post);
        $posts.append(
          '<li> <button data-UUID="' +
            post._id +
            '" type="button" id="deleteButton"><i class=\'fa fa-trash fa-2x \' aria-hidden=\'true\'></i></button> ' +
            '<b>text:</b> <span class="noEdit text">' +
            post.text +
            " </span> <input class='edit text'/>" +
            "<br>  <b>  Posted by:</b> <span class='name'>" +
            post.name +
            '</span>' +
            '<b> at</b> ' +
            moment(post.created)
              .startOf('minutes')
              .fromNow() +
            ' <button type="button"  class="editPost noEdit">Edit</button>' +
            '<button data-UUID="' +
            post._id +
            '" type="button" class="saveEdit edit">Save</button>' +
            '<button class="cancelEdit edit">Cancel</button></li>'
        );
      });
    },
    error: function() {
      alert("Couldn't load previous posts!");
    }
  });

  $.ajax({
    type: 'GET',
    url: 'currentUser',
    //async: "false",
    success: function(user) {
      console.log(user.username);
      ajaxUser = user.username;
      console.log('====================================');
      console.log(ajaxUser);
      console.log('====================================');
    }
  });
  /////////////////////////POST///////////////////////////
  $('#submit').on('click', function() {
    event.preventDefault();
    console.log(ajaxUser + 'after clicking submit');
    //what happens when submit is selected
    //$("#form-js").validate();
    console.log('you just clicked submit');
    var post = {
      text: $text.val(),
      userName: ajaxUser,
      //userName: $name.val(),
      created: new Date()
    };
    //$('#posts').find('input:text').val('');

    $.ajax({
      type: 'POST',
      url: '/posts',
      data: post,
      success: function(newPost) {
        console.log(newPost);
        $text.val('');
        $posts.append(
          '<li> <button data-UUID="' +
            newPost._id +
            '" type="button" id="deleteButton"><i class=\'fa fa-trash fa-2x\' aria-hidden=\'true\'></i></button> ' +
            '<b>text:</b> <span class="noEdit text">' +
            newPost.text +
            " </span> <input class='edit text'/>" +
            "<br> <b>Posted by:</b> <span class='name'>" +
            newPost.userName +
            '</span>' +
            '<b> at</b> ' +
            moment(newPost.created)
              .startOf('minutes')
              .fromNow() +
            ' <button type="button"  class="editPost noEdit">Edit</button>' +
            '<button data-UUID="' +
            newPost._id +
            ' "type="button" class="saveEdit edit">Save</button>' +
            '<button class="cancelEdit edit">Cancel</button></li>'
        );
      },
      error: function() {
        alert("Couldn't load previous posts!");
      }
    });
    //$('#submit').on('click', function () {
    //});
  });

  /////////////////////DELETE///////////////////////
  $posts.delegate('#deleteButton', 'click', function() {
    //have to use delegate instead of on click to work, i forgot why.
    var $li = $(this).closest('li');
    console.log('Sending request to Ajax to delete post');
    console.log(ajaxUser + 'from delete!');
    console.log(
      $(this)
        .closest('li')
        .find('span.name')
        .val()
    );

    if (ajaxUser === $li.find('span.name').text()) {
      console.log('delete worked');

      $.ajax({
        type: 'DELETE',
        url: '/posts/' + $(this).attr('data-UUID'),
        success: function(posts) {
          console.log(posts);
          $posts.html(''); //this clears page
          $.each(posts, function(index, post) {
            $posts.append(
              '<li> <button data-UUID="' +
                post._id +
                '" type="button" id="deleteButton"><i class=\'fa fa-trash fa-2x\' aria-hidden=\'true\'></i></button> ' +
                '<b>text:</b> <span class="noEdit text">' +
                post.text +
                " </span> <input class='edit text'/>" +
                "<br> <b>Posted by: </b> <span class='name'>" +
                post.name +
                '</span>' +
                '<b> at</b> ' +
                moment(post.created)
                  .startOf('minutes')
                  .fromNow() +
                ' <button type="button"  class="editPost noEdit">Edit</button>' +
                '<button data-UUID="' +
                post._id +
                ' "type="button" class="saveEdit edit">Save</button>' +
                '<button class="cancelEdit edit">Cancel</button></li>'
            );
          });
        },
        error: function() {
          alert('error deleting');
        }
      });
    } else {
      alert('Only original poster can delete!');
    }
  });
  ////////////////////////////PUT//////////////////////////
  $posts.delegate('.editPost', 'click', function() {
    //have to use delegate instead of on click to work, i forgot why.
    var $li = $(this).closest('li');
    if (ajaxUser === $li.find('span.name').text()) {
      $li.find('input.text').val($li.find('span.text').html());
      //$li.find("input.name").val($li.find("span.name").html() );
      $li.addClass('edit');
    } else {
      alert('Only original poster can edit!');
    }
  });

  $posts.delegate('.cancelEdit', 'click', function() {
    $(this)
      .closest('li')
      .removeClass('edit');
  });

  $posts.delegate('.saveEdit', 'click', function() {
    var $li = $(this).closest('li');
    console.log(
      $(this)
        .closest('li')
        .val('data-UUID')
    );
    var post = {
      text: $li.find('input.text').val(),
      userName: $li.find('span.name').text(),
      created: new Date()
    };

    console.log(post);
    console.log(
      $(this)
        .closest('li')
        .find('.saveEdit')
        .attr('data-UUID')
    );
    $.ajax({
      type: 'PUT',
      url: '/posts/' + $li.find('.saveEdit').attr('data-UUID'),
      data: post,
      success: function(posts) {
        console.log('currently putting', posts, post);
        $posts.html('');
        $.each(posts, function(index, post) {
          $posts.append(
            '<li> <button data-UUID="' +
              post._id +
              '" type="button" id="deleteButton"><i class=\'fa fa-trash fa-2x \' aria-hidden=\'true\'></i></button> ' +
              '<b>text:</b> <span class="noEdit text">' +
              post.text +
              " </span> <input class='edit text'/>" +
              "<br>  <b>  Posted by:</b> <span class='name'>" +
              post.name +
              '</span>' +
              '<b> at</b> ' +
              moment(post.created)
                .startOf('minutes')
                .fromNow() +
              ' <button type="button"  class="editPost noEdit">Edit</button>' +
              '<button data-UUID="' +
              post._id +
              '" type="button" class="saveEdit edit">Save</button>' +
              '<button class="cancelEdit edit">Cancel</button></li>'
          );
        });
        $li.find('span.text').html(posts.text);
        //$li.find("span.name").html(posts.name);
        $li.removeClass('edit');
      },
      error: function() {
        alert("Couldn't load previous posts!");
      }
    });
  });
});

$posts.delegate('.cancelEdit', 'click', function() {
  $(this)
    .closest('li')
    .removeClass('edit');
});

$posts.delegate('.saveEdit', 'click', function() {
  var $li = $(this).closest('li');
  console.log(
    $(this)
      .closest('li')
      .val('data-UUID')
  );
  var post = {
    text: $li.find('input.text').val(),
    userName: $li.find('span.name').text(),
    created: new Date()
  };

  console.log(post);
  console.log(
    $(this)
      .closest('li')
      .find('.saveEdit')
      .attr('data-UUID')
  );
  $.ajax({
    type: 'PUT',
    url: '/posts/' + $li.find('.saveEdit').attr('data-UUID'),
    data: post,
    success: function(posts) {
      console.log('currently putting', posts, post);
      $posts.html('');
      $.each(posts, function(index, post) {
        $posts.append(
          '<li> <button data-UUID="' +
            post._id +
            '" type="button" id="deleteButton"><i class=\'fa fa-trash fa-2x \' aria-hidden=\'true\'></i></button> ' +
            '<b>text:</b> <span class="noEdit text">' +
            post.text +
            " </span> <input class='edit text'/>" +
            "<br>  <b>  Posted by:</b> <span class='name'>" +
            post.name +
            '</span>' +
            '<b> at</b> ' +
            moment(post.created)
              .startOf('minutes')
              .fromNow() +
            ' <button type="button"  class="editPost noEdit">Edit</button>' +
            '<button data-UUID="' +
            post._id +
            '" type="button" class="saveEdit edit">Save</button>' +
            '<button class="cancelEdit edit">Cancel</button></li>'
        );
      });
      $li.find('span.text').html(posts.text);
      //$li.find("span.name").html(posts.name);
      $li.removeClass('edit');
    },
    error: function() {
      alert("Couldn't load previous posts!");
    }
  });
});
// });
