//this is where the front end javascript code goes
$("#form-js").submit(function(event){
	event.preventDefault();
	//what happens when submit is selected
	console.log("you just clicked submit");
});

function getValues (){
	var description = $("#description").val();
	var name = $("#name").val();

	$.ajax({
		type:'POST'
		ur
	})
}




