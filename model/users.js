const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		default:null
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
	},
	dob:{
		type:Date,
		default:null
	}
});


exports.default = mongoose.model('users', userSchema);
