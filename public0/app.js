//this is where the front end javascript code goes
/////
window.onload = function() {
  console.log("windowloaded");
  const token = localStorage.getItem('token');
  if (token===null){
    $('#RegisterLogin').removeClass('hidden')
    $('form').addClass('hidden')
    $('span').addClass('hidden')
    $('h2').removeClass('hidden')
    $('#logout').addClass('hidden')

  } else if (token!== null) {   //If token is present i.e. user is logged in, then there is a swap of options
    $('#RegisterLogin').addClass('hidden')
    $('#logout').removeClass('hidden')
  }

  $('#logout').on('click', function(){
    localStorage.removeItem('token')
  })

  const $posts = $('#posts');
  const $text = $('#text');
  const $name =
    $.ajax({
      type:'GET',
      url:'/currentUser',
      headers: {
        Authorization: `Bearer ${token}`
      },
      success:function(user){
        return user;
      }
    })
  $.ajax({
    type: 'GET',
    url: '/posts',
    success: function(posts) {
      $.each(posts, function(index, post) {
        $posts.append(
          // `<li class=${post.name}> <button data-UUID=` +
          "<li class=\"" + `${post.name}` +" list-item\">" + "<button data-UUID=" +

          post._id +
          ' type="button" class="deleteButton"><i class=\'fa fa-trash fa-2x \' aria-hidden=\'true\'></i></button> ' +
          '<b>text:</b> <span class="noEdit text">' +
          post.text +
          " </span> <input class='edit text edit-text-input' '/>" +
          "<br>  <b>  Posted by:</b> <span class='name'>" +
          post.name +
          '</span>' +
          '<b> at</b> ' +
          moment(post.created)
            .startOf('minutes')
            .fromNow() +
          ' <button type="button" id="editButton"  class="editPost noEdit editButton">Edit</button>' +
          '<button data-UUID=' +
          post._id +
          ' type="button" class="saveEdit edit saveButton" id="saveButton">Save</button>' +
          '<button class="cancelEdit edit cancelButton" id="cancelButton">Cancel</button></li>'
        );
        if (token===null) {
          $('button').addClass('hidden')
          $('input').addClass('hidden')
        }
      });
    },
    complete: function(post){
      for (var i = 0 ; i<post.responseJSON.length; i++){
        let postUser = post.responseJSON[i].name;
        if (postUser !==  $name.responseText){
          let differentUser = postUser;
          $(`.${differentUser}  .editButton`).addClass('hidden')
          $(`.${differentUser}  .saveButton`).addClass('hidden')
          $(`.${differentUser}  .deleteButton`).addClass('hidden')
          $(`.${differentUser}  .cancelButton`).addClass('hidden')
          $(`.${differentUser}  .edit-text-input`).addClass('hidden')
        }
      };
    },
    error: function() {
      alert("Couldn't load previous posts!");
    }
  });

  /////////////////////////POST///////////////////////////
  $('#submit').on('click', function() {
    event.preventDefault();
    var post = {
      text: $text.val(),
      userName: $name.responseText,
      created: new Date()
    };
    $.ajax({
      type: 'POST',
      url: '/posts',
      data: post,
      success: function(newPost) {
        $text.val('');
        $posts.append(
          "<li class=\"" + `${post.name}` +" list-item\">" + "<button data-UUID=" +
            newPost._id +
            ' type="button" id="deleteButton"><i class=\'fa fa-trash fa-2x\' aria-hidden=\'true\'></i></button> ' +
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
      complete: function(){
        location.reload();
      },
      error: function() {
        alert("Couldn't load previous posts!");
      }
    });
  }); //End of Submit POST

  /////////////////////DELETE///////////////////////
  $posts.delegate('.deleteButton', 'click', function() {
    //have to use delegate instead of on click to work, i forgot why.
    var $li = $(this).closest('li');
    // if ($name.responseText === $li.find('span.name').text()) {
    if ($name.responseText === $li.find('span.name').text()) {
      console.log("deleteButton clicked after logic");
      $.ajax({
        type: 'DELETE',
        url: '/posts/' + $(this).attr('data-UUID'),
        success: function(posts) {
          $posts.html('');
        },
        complete: function(){
            location.reload();
        },
        error: function() {
          alert('error deleting');
        }
      });
    } else {
      alert('Only original poster can delete!');
    }
  }); //End of Delete POST


  ////////////////////////////PUT//////////////////////////
  $posts.delegate('.editPost', 'click', function() {
    //have to use delegate instead of on click to work, i forgot why.
    var $li = $(this).closest('li');
    if ($name.responseText === $li.find('span.name').text()) {
      $li.find('input.text').val($li.find('span.text').html());
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

  // Actually beginning to save edited post
  $posts.delegate('.saveEdit', 'click', function() {
    var $li = $(this).closest('li');
    var post = {
      text: $li.find('input.text').val(),
      userName: $li.find('span.name').text(),
      created: new Date()
    };
    $.ajax({
      type: 'PUT',
      url: '/posts/' + $li.find('.saveEdit').attr('data-UUID'),
      data: post,
      success: function(posts) {
        $posts.html('');
      },
      complete: function(){
        location.reload()
      },
      error: function() {
        alert("Couldn't load previous posts!");
      }
    });
  }); //End of PUT POST
};
