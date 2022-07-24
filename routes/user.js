const express = require('express');
const router = express.Router();
const User = require('../model/usersModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const emailMethod = require('../helpers/emailHelper');

router.post('/exist', async (req, res) => {
	let postData = req.body;
	try {
		let result = await User.find({ user: postData.user });
		let data =
			result.length > 0
				? { status: 'ok', message: 'not Found' }
				: { status: 'error', errorMessage: 'User Aldready found!' };
		return res.status(200).json({ data });
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server getting error!'
		});
		throw err;
	}
});

router.post('/create', async (req, res) => {
	let postData = req.body;
	try {
		let result = await new User(postData);
		await result.save();
		await emailMethod({ method: 'activation' }, result);
		return res.status(201).json({ status: 'ok', data: result });
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server is not working'
		});
		throw err;
	}
});

router.post('/activate', async (req, res) => {
	let postData = req.body;
	try {
		let result = await User.findById(postData.ID);
		if (result === null) {
			result = await User.findOne({ email: postData.ID });
			if (result === null) {
				result == (await User.findOne({ user: ID }));
				if (result === null) {
					return res.status(200).json({
						status: error,
						errorMessage: 'unnable to find user Details'
					});
				}
			}
		}
		if (result.isActive === true) {
			return res.status(201).json({
				status: 'ok',
				message: 'Your Account is aldready activated !'
			});
		}
		if (result.otp === postData.otp) {
			result.isActive = true;
			await User.updateOne(result);
			return res
				.status(201)
				.json({ status: 'ok', message: 'Your Account is activated !' });
		} else {
			res.status(200).json({
				status: 'error',
				errorMessage: 'please enter valid OTP!'
			});
		}
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server getting error!'
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
		if (userDetails.isActive === false) {
			return res.status(200).json({
				status: 'error',
				errorMessage: 'Please activate your Acount!'
			});
		}
		let verifyPassword = await bcrypt.compareSync(
			postData.password,
			userDetails.password
		);
		if (!verifyPassword) {
			return res
				.status(200)
				.json({ status: 'error', errorMessage: 'password did not match!' });
		}
		let token = await jwt.sign(
			{
				data: userDetails,
				exp: Math.floor(Date.now() / 1000 + 60 * 60 * 24)
			},
			process.env.SECRET
		);
		let data = jwt.verify(token, process.env.SECRET);
		let date = new Date(data.exp * 1000);
		data.data.password = '<hidden>';
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
	let Query = ['firstName', 'lastName', 'email', 'dob'];
	let returnData = [];
	try {
		for (let temp of postData.mobile) {
			let result = await User.findOne({ mobile: temp }).select(Query);
			returnData.push(result);
		}
		return res.status(200).json({ status: 'ok', data: returnData });
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server getting error!'
		});
		throw err;
	}
});

router.post('/changepassword', async (req, res) => {
	let postData = req.body;
	try {
		let result = await User.findById(postData.ID);
		if (result == null) {
			return res.status(200).json({
				status: error,
				errorMessage: 'unnable to find user Details'
			});
		}
		let verifyPassword = await bcrypt.compareSync(
			postData.password,
			result.password
		);
		if (!verifyPassword) {
			return res
				.status(200)
				.json({ status: 'error', errorMessage: 'password did not match!' });
		}
		result.password = postData.newPassword;
		result = await User(result);
		result.save();
		return res
			.status(200)
			.json({ status: 'ok', data: 'password Updated SuccessFully!' });
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server getting error!'
		});
		throw err;
	}
});

router.post('/sendotp', async (req, res) => {
	let postData = req.body;
	let result = null;
	try {
		if (result === null) {
			result = await User.findOne({ email: postData.ID });
			if (result === null) {
				result == (await User.findOne({ user: postData.ID }));
				if (result === null) {
					result = await User.findById(postData.ID);
					if (result === null) {
						return res.status(200).json({
							status: error,
							errorMessage: 'unnable to find user Details'
						});
					}
				}
			}
		}
		let data = await emailMethod.sendOTP(postData, result);
		result.otp = data.otp;
		if (postData.method !== 'resend') {
			await User.updateOne(result);
		}
		res.status(200).json({
			status: 'ok',
			message: 'email send successfully'
		});
	} catch (err) {
		res.status(500).json({
			status: 'err',
			errorMessage: 'server getting error!'
		});
		throw err;
	}
});

module.exports = router;
