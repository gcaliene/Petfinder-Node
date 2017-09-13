//where mock data will go.

var MOCK_PET_SIGHTINGS = {
	"sightings" : [
		{
			"id": 11111,
			"text": "Lost puppy seen behind the gas station",
			"userId": "aaaaa",
			"userName": "mary joe",
			"publishedAt": 999999
		},
		{
			"id": 22222,
			"text": "I think I saw a cat rummaging my trash can",
			"userId": "bbbbb",
			"userName": "jon smith",
			"publishedAt": 888888
		},
		{
			"id": 33333,
			"text": "Lost puppy wandering the park by the school",
			"userId": "ccccc",
			"userName": "corey martin",
			"publishedAt": 777777
		},
		{
			"id": 44444,
			"text": "kittens heard around the community pool around noon",
			"userId": "ddddd",
			"userName": "dylan doug",
			"publishedAt": 666666
		},
	]
};

// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRecentStatusUpdates(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callbackFn(MOCK_PET_SIGHTINGS)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (index in data.statusUpdates) {
	   $('body').append(
        '<p>' + data.statusUpdates[index].text + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
	getRecentStatusUpdates(displayStatusUpdates);
}

//  on page load do this
$(function() {
	getAndDisplayStatusUpdates();
})