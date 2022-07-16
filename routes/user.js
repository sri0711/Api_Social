const express = require('express');
const router = express.Router();
const User = require('../model/usersModel');
const jwt = require('jsonwebtoken');

router.post('/create', async (req, res) => {
	let postData = req.body;
	try {
		let result = await new User(postData);
		await result.save();
		return res.status(201).json({ status: 'ok', data: result });
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server is not working'
		});
		throw err;
	}
});

router.post('/login', async (req, res) => {
	let postData = req.body;
	let userDetails;
	try {
		userDetails = await User.findOne({
			user: postData.userName
		});
		if (userDetails === null) {
			console.log('ok');
			userDetails = await User.findOne({
				email: postData.userName
			});
			if (userDetails === null)
				return res.status(200).json({
					status: error,
					errorMessage: 'user Details not Found!'
				});
		}
		console.log(userDetails);
		res.status(200).json({ userDetails });
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server is not working'
		});
		throw err;
	}
});

module.exports = router;
