const mailer = require('nodemailer');
let inject = (str, obj) => str.replace(/\{{(.*?)}}/g, (x, g) => obj[g]);
const fs = require('fs');

const emailMethod = {
	sendOTP: async (postData, userData) => {
		let htmlFile;
		let transpoter = mailer.createTransport({
			service: 'gmail',
			host: 'smtp.gmail.com',
			secure: false,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EPASS
			}
		});
		let data = {
			otp: Math.floor(Math.random() * (999999 - 100000)) + 10000,
			email: userData.email,
			fistName: userData.fistName,
			lastName: userData.lastName,
			user: userData.user,
			subject: ''
		};
		if (postData.method === 'activation') {
			let htmlData = await fs
				.readFileSync('./templates/activation.html')
				.toString();
			htmlFile = await inject(htmlData, data);
			data.subject = 'Account Activation';
		}
		if (postData.method === 'resend') {
			let htmlData = await fs
				.readFileSync('./templates/activation.html')
				.toString();
			htmlFile = await inject(htmlData, userData.otp);
			data.subject = 'Account Activation';
			data.otp = userData.otp;
		}
		if (postData.method === 'forgot') {
			let htmlData = await fs
				.readFileSync('./templates/activation.html')
				.toString();
			htmlFile = await inject(htmlData, data);
			data.subject = 'Account Activation';
		}
		var mailOptions = {
			from: '"dummy chat" youremail@gmail.com',
			to: data.email,
			subject: data.subject,
			html: htmlFile
		};
		transpoter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email sent: ' + info.response);
			}
		});
		return { otp: data.otp };
	}
};

module.exports = emailMethod;
