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
				$posts.append('<li> <button data-UUID="{{_id}}" type="button" id="deleteButton"> Delete</button> <button type="button"  id="updateButton">Update</button> <b>text:</b> ' + post.text + " name: " + post.name + ' at ' + post.created + '</li>');
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
				$posts.append('<li> <button data-UUID="{{_id}}" type="button" id="deleteButton"> Delete</button> <button type="button" id="updateButton">Update</button> text: ' + post.text + " name: " + post.userName + '  at ' + Date(post.created) + ' </li>');
			},
			error: function(){
				alert('Couldn\'t load previous posts!');
			},
		})
	});

	
	$posts.delegate('#deleteButton','click', function(){
		console.log('Sending request to Ajax to delete post'); //not showing up because no delete button exists yet.
		$.ajax({
			type:'DELETE',
			url:'/posts/' + $(this).attr('data-UUID'),
		});

	});
});







