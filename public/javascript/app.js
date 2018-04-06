
$(document).on('click', '.save', function(event) {
	event.preventDefault();
	var word = $(this).closest('.card').attr('data');
	var sentence = $(this).closest('.card-body').find('.card-title').text();
	var meaning = $(this).closest('.card-body').find('.card-text').text();

	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/saved",
		data: {
			word: word,
			sentence: sentence,
			meaning: meaning
		}
	}).then(function(data) {
		console.log(data);
	});
});