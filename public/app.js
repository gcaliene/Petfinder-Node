//this is where the front end javascript code goes



$(function(){
	var $posts = $("#posts");
	var $text = $("#text");
	var $name = $("#name");
	$.ajax({
		type:"GET",
		url: "/posts",
		success: function(posts){
			$.each(posts, function(index, post){
				console.log(post);
				$posts.append("<li> <button data-UUID=\""+ post._id +"\" type=\"button\" id=\"deleteButton\"><i class='fa fa-trash fa-2x edit' aria-hidden='true'></i></button>  <b>text:</b> <span class=\"noEdit text\">" + post.text + " </span> <input class='edit text'/> <b>name:</b> <span class='noEdit name'>" + post.name + "</span> <input class=\"edit name\"/> <b>at</b> " + post.created + " <button type=\"button\"  class=\"editPost noEdit\">Edit</button> <button data-UUID=\""+ post._id +"\" type=\"button\" class=\"saveEdit edit\">Save</button><button class=\"cancelEdit edit\">Cancel</button></li>");
			});
		},
		error: function(){
			alert("Couldn't load previous posts!");
		}
	});

	$.ajax({
		type:"GET",
		url:"/currentUser",
		success: function(user){
			console.log(user.username);
			const ajaxUser = user.username;
			console.log('====================================');
			console.log(ajaxUser);
			console.log('====================================');
		}
	})

	$("#submit").on("click", function(){
		event.preventDefault();
		//what happens when submit is selected
		//$("#form-js").validate();
		console.log("you just clicked submit");
		var post = {
			text: $text.val(),
			//userName: $name.val(),
			created: new Date(),
		};
		$.ajax({
			type:"POST",
			url:"/posts",
			data: post,
			success: function(newPost) {
				console.log(newPost);
				$posts.append("<li> <button data-UUID=\""+ newPost._id +"\" type=\"button\" id=\"deleteButton\"><i class='fa fa-trash fa-2x edit' aria-hidden='true'></i></button>  <b>text:</b> <span class=\"noEdit text\">" + newPost.text + " </span> <input class='edit text'/> <b>name:</b> <span class='noEdit name'>" + newPost.userName + "</span> <input class=\"edit name\"/> <b>at</b> " + newPost.created + " <button type=\"button\"  class=\"editPost noEdit\">Edit</button> <button data-UUID=\""+ newPost._id +" \"type=\"button\" class=\"saveEdit edit\">Save</button><button class=\"cancelEdit edit\">Cancel</button></li>");
			},
			error: function(){
				alert("Couldn't load previous posts!");
			},
		});
	});

	
	$posts.delegate("#deleteButton","click", function(){ //have to use delegate instead of on click to work
		//if (
		console.log("Sending request to Ajax to delete post"); 
		$.ajax({
			type:"DELETE",
			url:"/posts/" + $(this).attr("data-UUID"),
			success: function(posts) {
				console.log(posts);
				$posts.html(""); //this clears page
				$.each(posts, function(index, post){
					$posts.append("<li> <button data-UUID=\""+ post._id +"\" type=\"button\" id=\"deleteButton\"><i class='fa fa-trash fa-2x edit' aria-hidden='true'></i></button>  <b>text:</b> <span class=\"noEdit text\">" + post.text + " </span> <input class='edit text'/> <b>name:</b> <span class='noEdit name'>" + post.name + "</span> <input class=\"edit name\"/> <b>at</b> " + post.created + " <button type=\"button\"  class=\"editPost noEdit\">Edit</button> <button data-UUID=\""+ post._id +"\"type=\"button\" class=\"saveEdit edit\">Save</button><button class=\"cancelEdit edit\">Cancel</button></li>");
				});
			},
			error: function(){
				alert("error deleting");
			}
		});

	});

	$posts.delegate(".editPost", "click", function() {
		var $li = $(this).closest("li");
		$li.find("input.text").val($li.find("span.text").html() );
		$li.find("input.name").val($li.find("span.name").html() );
		$li.addClass("edit");
	});

	$posts.delegate(".cancelEdit", "click", function() {
		$(this).closest("li").removeClass("edit");
	});

	$posts.delegate(".saveEdit", "click", function() {
		var $li= $(this).closest("li");
		console.log($(this).closest("li").val("data-UUID"));
		var post = {
			text: $li.find("input.text").val(),
			userName: $li.find("input.name").val(),
			created: new Date(),
		};

		console.log(post);
		console.log($(this).closest("li").find(".saveEdit").attr("data-UUID")); 
		$.ajax({
			type:"PUT",
			url:"/posts/" + $li.find(".saveEdit").attr("data-UUID"),
			data: post,
			success: function(posts) {
				console.log("currently putting", posts, post);
				$posts.html("");
				$.each(posts, function(index, post) {
					$posts.append("<li> <button data-UUID=\""+ post._id +"\" type=\"button\" id=\"deleteButton\"><i class='fa fa-trash fa-2x edit' aria-hidden='true'></i></button>  <b>text:</b> <span class=\"noEdit text\">" + post.text + " </span> <input class='edit text'/> <b>name:</b> <span class='noEdit name'>" + post.name + "</span> <input class=\"edit name\"/> <b>at</b> " + post.created + " <button type=\"button\"  class=\"editPost noEdit\">Edit</button> <button data-UUID=\""+ post._id +"\" type=\"button\" class=\"saveEdit edit\">Save</button><button class=\"cancelEdit edit\">Cancel</button></li>");
				});
				$li.find("span.text").html(posts.text);
				$li.find("span.name").html(posts.name);
				$li.removeClass("edit");
			},
			error: function(){
				alert("Couldn't load previous posts!");
			},
		});		
	});

});







