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
      },
      error: function(){
        console.log("User Not Logged In");
      }
    })
  $.ajax({
    type: 'GET',
    url: '/posts',
    success: function(posts) {
      $.each(posts, function(index, post) {
        $posts.append(
          "<li class=\"" + post.name +" list-item\">" +
          '<b> <span  class="text">' +
          post.text +
          " </span> </b> <input id=\"post-edit-span\" class='edit text edit-text-input' '/>" +
          "<br>  <u><span class='name'>" +
          post.name +
          '</span></u><br> <i class="list-item-time">' +
          moment(post.created)
            .startOf('minutes')
            .fromNow() +
          '</i> </br><button type="button" id="editButton"  class="editPost noEdit editButton"><i class="fa fa-pencil" aria-hidden="true"></i></button>' +
          '<button data-UUID=' +
          post._id +
          ' type="button" class="saveEdit edit saveButton" id="saveButton"><i class="fa fa-floppy-o" aria-hidden="true"></i></button>' +
          '<button class="cancelEdit edit cancelButton" id="cancelButton"><i class="fa fa-ban" aria-hidden="true"></i></button>' +
          "<button data-UUID=" +
          post._id +
          ' type="button" id="deleteButton" class="deleteButton edit"><i class=\'fa fa-trash   \' aria-hidden=\'true\'></i></button></li>'
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
    const post = {
      text: $text.val(),
      userName: $name.responseText,
      created: Date.now()
    };
    $.ajax({
      type: 'POST',
      url: '/posts',
      data: post,
      success: function(newPost) {
        $text.val('');
        $posts.append(
          "<li class=\"" + newPost.userName +" list-item\">" + "<button data-UUID=" +
            newPost._id +
            ' type="button" class="deleteButton"><i class=\'fa fa-trash fa-2x \' aria-hidden=\'true\'></i></button> ' +
            '<b>text:</b> <span  class="text">' +
            newPost.text +
            " </span> <input id=\"post-edit-span\" class='edit text edit-text-input' '/>" +
            "<br>  <b>  Posted by:</b> <span class='name'>" +
            newPost.userName +
            '</span><br> <i class="list-item-time">' +
            moment(newPost.created)
              .startOf('minutes')
              .fromNow() +
              '</i> <button type="button" id="editButton"  class="editPost noEdit editButton">Edit</button>' +
              '<button data-UUID=' +
            newPost._id +
            ' type="button" class="saveEdit edit saveButton" id="saveButton">Save</button>' +
            '<button class="cancelEdit edit cancelButton" id="cancelButton">Cancel</button></li>'
        );
      },
      error: function() {
        alert("Please provide a description before submitting.");
      }
    });
  }); //End of Submit POST

  /////////////////////DELETE///////////////////////
  $posts.delegate('.deleteButton', 'click', function() {
    //have to use delegate instead of on click to work, i forgot why.
    var $li = $(this).closest('li');
    if ($name.responseText === $li.find('span.name').text()) {
      $.ajax({
        type: 'DELETE',
        url: '/posts/' + $(this).attr('data-UUID'),
        success: function(posts) {
          $posts.html('');
          $.each(posts, function(index, item) {
  					$posts.append(
              "<li class=\"" + item.name +" list-item\">" + "<button data-UUID=" +
                item._id +
                ' type="button" class="deleteButton"><i class=\'fa fa-trash fa-2x \' aria-hidden=\'true\'></i></button> ' +
                '<b>text:</b> <span  class="text">' +
                item.text +
                " </span> <input id=\"post-edit-span\" class='edit text edit-text-input' '/>" +
                "<br>  <b>  Posted by:</b> <span class='name'>" +
                item.name +
                '</span><br> <i class="list-item-time">' +
                moment(item.created).startOf('minutes').fromNow() +
                '</i> <button type="button" id="editButton"  class="editPost noEdit editButton">Edit</button>' +
                '<button data-UUID=' +
                item._id +
                ' type="button" class="saveEdit edit saveButton" id="saveButton">Save</button>' +
                '<button class="cancelEdit edit cancelButton" id="cancelButton">Cancel</button></li>');
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
          alert('error deleting');
        }
      });
    } else {
      alert('Only original poster can delete!');
    }
  }); //End of Delete POST


  ////////////////////////////PUT//////////////////////////
  $posts.delegate('.editPost', 'click', function() {
    console.log("clicked edit");
    //have to use delegate instead of on click to work, i forgot why.
    const $li = $(this).closest('li');
    if ($name.responseText === $li.find('span.name').text()) {
      console.log($li.find('input.text').val($li.find('span.text').html()));
      $li.find('input.text').val($li.find('span.text').html());
      $li.find("span.text").addClass('hidden');
      $li.find("input#post-edit-span").removeClass('edit');
      $li.find("button#editButton").addClass('edit');
      $li.find("button#saveButton").removeClass('edit');
      $li.find("button#cancelButton").removeClass('edit');
      $li.find("button#deleteButton").removeClass('edit');

    } else {
      alert('Only original poster can edit!');
    }
  });

  $posts.delegate('#cancelButton', 'click', function() {
    const $li = $(this).closest('li');
    console.log("cancel button clicked");
    $li.find("span.text").removeClass('hidden');
    $li.find("input#post-edit-span").addClass('edit');
    $li.find("button#editButton").removeClass('edit');
    $li.find("button#saveButton").addClass('edit');
    $li.find("button#cancelButton").addClass('edit');
    $li.find("button#deleteButton").addClass('edit');

  });

  // Actually beginning to save edited post
  $posts.delegate('.saveEdit', 'click', function() {
    const $li = $(this).closest('li');
    const post = {
      text: $li.find('input.text').val(),
      userName: $li.find('span.name').text(),
      created:  Date.now()
    };
    $.ajax({
      type: 'PUT',
      url: '/posts/' + $li.find('.saveEdit').attr('data-UUID'),
      data: post,
      success: function(posts) {
        console.log(posts);
        $posts.html('');
        $.each(posts, function(index, item) {
					$posts.append(
            "<li class=\"" + item.name +" list-item\">" + "<button data-UUID=" +
              item._id +
              ' type="button" class="deleteButton"><i class=\'fa fa-trash fa-2x \' aria-hidden=\'true\'></i></button> ' +
              '<b>text:</b> <span  class="text">' +
              item.text +
              " </span> <input id=\"post-edit-span\" class='edit text edit-text-input' '/>" +
              "<br>  <b>  Posted by:</b> <span class='name'>" +
              item.name +
              '</span><br> <i class="list-item-time">' +
              moment(item.created).startOf('minutes').fromNow() +
              '</i> <button type="button" id="editButton"  class="editPost noEdit editButton">Edit</button>' +
              '<button data-UUID=' +
              item._id +
              ' type="button" class="saveEdit edit saveButton" id="saveButton">Save</button>' +
              '<button class="cancelEdit edit cancelButton" id="cancelButton">Cancel</button></li>');
				});
				$li.find("span.text").html(posts.text);
				//$li.find("span.name").html(posts.name);
				$li.removeClass("edit");
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
  }); //End of PUT POST
};
