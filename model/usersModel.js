const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		default: null
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	mobile: {
		type: Number,
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
	dob: {
		type: Date,
		default: null
	},
	otp: {
		type: Number,
		default: null
	},
	isActive: {
		type: Boolean,
		default: false
	}
});

userSchema.pre('save', async function (next) {
	this.password = await bcrypt.hash(this.password, 13);
	next();
});

let usersModel = mongoose.model('users', userSchema);

module.exports = usersModel;
