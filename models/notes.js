// mongoose and schema constructor
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create schema
var NoteSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	body: String
});

// create model and export
var Notes = mongoose.model("Notes", NoteSchema);
module.exports = Notes;