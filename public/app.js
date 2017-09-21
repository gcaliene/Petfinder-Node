//this is where the front end javascript code goes
$("#form-js").submit(function(event){
	event.preventDefault();
	//what happens when submit is selected
	console.log("you just clicked submit");
});
var description = $("#description").val();
var name = $("#name").val();

$(function(){
var $posts = $('#posts');
	$.ajax({
		type:'GET',
		url: '/posts',
		success: function(posts){
			$.each(posts, function(index, item){
				$posts.append('<li> text: ' + item.text + " name: " + item.name + '</li>');
			});
		}
	});

	$.aja

});






