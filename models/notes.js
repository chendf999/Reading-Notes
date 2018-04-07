// mongoose and schema constructor
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create schema
var NoteSchema = new Schema({
	text: {
		type: String,
		required: true
	},
	createAt: {
		type: Date,
		default: Date.now
	}
});

// create model and export
var Notes = mongoose.model("Notes", NoteSchema);
module.exports = Notes;