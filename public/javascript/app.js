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
		$('#newNote').attr('data', _id);

		data.notes.forEach(function(_id){
			$.ajax({
				type: "GET",
				url: "/note/" + _id
			}).then(function(note) {
				var tr = `<tr><td>${note.createAt}</td>
				<td>${note.text}</td>
				<td class="text-right"><a href="#" class="delete" data="${note._id}">Delete</a></td>
				</tr>`
				$('#current-notes').append(tr);
			});
		});

	});
});

// close lightbox
$(document).on('click', '.close', function(){
	$('#current-notes').empty();
});

$(document).on('click', '.add', function(){
	var text = $('#newNote').val();
	var _id = $('#newNote').attr('data');

	$.ajax({
		type: "POST",
		url: "/add",
		data: {
			_id: _id,
			text: text
		}
	}).then(function(){
		$('#newNote').val('');
		window.location.reload(true);
	});
});

$(document).on('click', '.delete', function(){
	var _id = $(this).attr('data');
	var tr = $(this).closest('tr');
	console.log(_id);

	$.ajax({
		type: "POST",
		url: "/delete",
		data: {
			_id: _id
		}
	}).then(function(){
		console.log('delete');
		tr.remove();
	});
});
