// scrape data
$('#scrape').on('click', function(){
	$.ajax({
		type: "GET",
		url: "/scrape",
	}).done( function(data) {
		window.location.reload(true);
	});
});

// save
$(document).on('click', '.save', function() {
	var _id = $(this).closest('.card').attr('data');
	save_status(_id, true);
});

// unsave
$(document).on('click', '.unsave', function() {
	var _id = $(this).closest('.card').attr('data');
	save_status(_id, false);
});

function save_status(_id, status){
	$.ajax({
		type: "POST",
		url: "/word/" + _id,
		data: {
			_id: _id,
			saved: status
		}
	}).then(function(data) {
		window.location.reload(true);
	});
}

// lightbox
$(document).on('click', '.detail', function(){
	var _id = $(this).closest('.card').attr('data');

	$.ajax({
		type: "GET",
		url: "/word/" + _id
	}).then(function(data) {
		$('#current-word h5').text(data.word);
		$('#current-word p').text(data.meaning);
		console.log(data.notes);

		// data.notes.forEach(function(note){
		// 	var tr = `<tr><td>${note.createAt}</td>
		// 	<td>${note.text}</td>
		// 	<td class="text-right"><a href="#" class="delete">Delete</a></td>
		// 	</tr>`
		// 	$('#current-notes').append(tr);
		// });
	});
});

// close lightbox
$(document).on('click', '.close', function(){
	$('#current-notes').empty();
});

$(document).on('click', '.add', function(){
	var text = $('#newNote').val();
	var word = $('#current-word h5').text();

	$.ajax({
		type: "POST",
		url: "/add",
		data: {
			word: word,
			text: text
		}
	}).then(function(){
		$('#newNote').val('');
	});
});
