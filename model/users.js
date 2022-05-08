const mongoose = require('mongoose');

let mongooseSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	mobile: {
		type: String,
		required: true
	},
	user: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});
