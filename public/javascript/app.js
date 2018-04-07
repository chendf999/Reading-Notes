
// scrape
$('#scrape').on('click', function(){
	$.ajax({
		type: "GET",
		dataType: "json",
		url: "/api/scrape",
	}).done( function(data) {
		window.location.replace('/');
	});
});

// save
$(document).on('click', '.save', function(event) {
	event.preventDefault();
	var route = $(this).closest('.card').attr('data');

	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/api/save",
		data: {
			route: route
		}
	}).then(function(data) {
		window.location.replace('/');
	});
});

// unsave
$(document).on('click', '.unsave', function(event) {
	event.preventDefault();
	var route = $(this).closest('.card').attr('data');

	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/api/unsave",
		data: {
			route: route
		}
	}).then(function(data) {
		window.location.replace('/');
	});
});