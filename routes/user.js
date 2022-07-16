const express = require('express');
const router = express.Router();
const User = require('../model/usersModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
			userDetails = await User.findOne({
				email: postData.userName
			});
			if (userDetails === null)
				return res.status(200).json({
					status: error,
					errorMessage: 'user Details not Found!'
				});
		}
		let verifyPassword = await bcrypt.compareSync(
			postData.password,
			userDetails.password
		);
		if (!verifyPassword)
			return res
				.status(200)
				.json({ status: 'error', errorMessage: 'password did not match!' });
		let token = await jwt.sign(
			{
				data: userDetails,
				exp: Math.floor(Date.now() / 1000 + 60 * 60 * 24)
			},
			process.env.SECRET
		);
		let data = jwt.verify(token, process.env.SECRET);
		let date = new Date(data.exp * 1000);
		res.status(200).json({
			token,
			data: data.data,
			expairyDate: date.toString()
		});
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server getting error!'
		});
		throw err;
	}
});

router.post('/get', async (req, res) => {
	let postData = req.body;
	try {
		let result = await User.find({ mobile: postData.mobile });
		return res.status(200).json({ status: 'ok', data: result });
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server getting error!'
		});
		throw err;
	}
});

module.exports = router;
