
$(document).on('click', '.save', function(event) {
	event.preventDefault();

	var word = $(this).closest('.card-body').find('.card-title').text();
	var meaning = $(this).closest('.card-body').find('.card-text').text();
	var link = $(this).closest('.card').attr('data');
	var route = word.replace(/[^\w\s]/gi, '').replace(/ /g, '-');
	var image = $(this).closest('.card').find('img').attr('src');

	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/saved",
		data: {
			word: word,
			meaning: meaning,
			image: image,
			route: route,
			link: link
		}
	}).then(function(data) {
		console.log(data);
	});
});