// mongoose and schema constructor
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create schema
var WordSchema = new Schema({
	word: {
		type: String,
		required: true,
		unique: true
	},
	meaning: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	saved: {
		type: Boolean,
		required: true
	},
	createAt: {
		type: Date,
		default: Date.now
	},
	notes: [{
		type: Schema.Types.ObjectId,
		ref: 'Notes'
	}]
});

// create model and export
var Words = mongoose.model("Words", WordSchema);
module.exports = Words;