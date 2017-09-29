//this is where the front end javascript code goes



$(function(){
var $posts = $('#posts');
var $text = $("#text");
var $name = $("#name");
	$.ajax({
		type:'GET',
		url: '/posts',
		success: function(posts){
			$.each(posts, function(index, post){
				$posts.append('<li> <button data-UUID="'+ post.id +'" type="button" id="deleteButton">X</button>  <b>text:</b> <span class="noEdit text">' + post.text + " </span> <input class='edit text'/> <b>name:</b> <span class='noEdit name'>" + post.name + '</span> <input class="edit name"/> <b>at</b> ' + post.created + ' <button type="button"  class="editPost noEdit">Edit</button> <button type="button" class="saveEdit edit">Save</button><button class="cancelEdit edit">Cancel</button></li>');
			});
		},
		error: function(){
			alert('Couldn\'t load previous posts!');
		}
	});

	$("#submit").on('click', function(){
		event.preventDefault();
		//what happens when submit is selected
		console.log("you just clicked submit");
		var post = {
			text: $text.val(),
			userName: $name.val(),
			created: new Date(),
		};
		$.ajax({
			type:'POST',
			url:'/posts',
			data: post,
			success: function(newPost) {
				console.log(newPost);
				$posts.append('<li> <button data-UUID="'+ newPost._id +'" type="button" id="deleteButton">X</button>  <b>text:</b> <span class="noEdit text">' + newPost.text + " </span> <input class='edit text'/> <b>name:</b> <span class='noEdit name'>" + newPost.userName + '</span> <input class="edit name"/> <b>at</b> ' + newPost.created + ' <button type="button"  class="editPost noEdit">Edit</button> <button type="button" class="saveEdit edit">Save</button><button class="cancelEdit edit">Cancel</button></li>');
			},
			error: function(){
				alert('Couldn\'t load previous posts!');
			},
		})
	});

	
	$posts.delegate('#deleteButton','click', function(){ //have to use delegate instead of on click to work
		console.log('Sending request to Ajax to delete post'); 
		$.ajax({
			type:'DELETE',
			url:'/posts/' + $(this).attr('data-UUID'),
			success: function(posts) {
				console.log(posts);
				$posts.html(""); //this clears page
				$.each(posts, function(index, post){
					$posts.append('<li> <button data-UUID="'+ post.id +'" type="button" id="deleteButton">X</button>  <b>text:</b> <span class="noEdit text">' + post.text + " </span> <input class='edit text'/> <b>name:</b> <span class='noEdit name'>" + post.name + '</span> <input class="edit"/> <b>at</b> ' + post.created + ' <button type="button"  class="editPost noEdit">Edit</button> <button type="button" class="saveEdit edit">Save</button><button class="cancelEdit edit">Cancel</button></li>');
				});
			},
error: function(){
				alert('error deleting');
			}
		});

	});

	$posts.delegate('.editPost', 'click', function() {
		var $li = $(this).closest('li');
		$li.find('input.text').val($li.find('span.text').html() );
		$li.find('input.name').val($li.find('span.name').html() );
		$li.addClass('edit');
	});

	$posts.delegate('.cancelEdit', 'click', function() {
		$(this).closest('li').removeClass('edit');
	});

	$posts.delegate('.saveEdit', 'click', function() {
		var $li= $(this).closest('li');
		var post = {
			text: $li.find('input.text').val(),
			userName: $li.find('input.name').val(),
			created: new Date(),	
		};

		console.log(post);

		$.ajax({
			type:'PUT',
			url:'/posts/' + $(this).closest('li').attr('data-UUID'),
			data: post,
			success: function(newPost) {
				console.log(newPost);
				$posts.append('<li> <button data-UUID="'+ post.id +'" type="button" id="deleteButton"> Delete</button> <button type="button" id="updateButton">Update</button> text: ' + newPost.text + " name: " + newPost.userName + '  at ' + newPost.created + ' </li>');
				$li.find('span.text').html(newPost.text);
				$li.find('span.name').html(newPost.name);
				$li.removeClass('edit');
			},
			error: function(){
				alert('Couldn\'t load previous posts!');
			},
		})		
	});

});







