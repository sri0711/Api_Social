const jwt = require('jsonwebtoken');
const commonRoutes = ['/', '/user/create', '/user/login'];

module.exports = (req, res, next) => {
	const routePath = String(req.originalUrl).toLowerCase();
	let token = req.headers['x-access-token'] || req.headers['authorization'];
	if (token) {
		if (token.startsWith('Bearer')) {
			token = token.replace('Bearer ', '');
			try {
				var decoded = jwt.verify(token, process.env.SECRET);
				console.log(decoded);
				next();
			} catch (err) {
				return res.status(403).json({
					status: 'error',
					errorMessage: err
				});
			}
		}
	} else if (commonRoutes.includes(routePath)) {
		next();
	} else {
		return res.status(403).json({
			status: 'error',
			errorMessage: 'No Token Provided!.'
		});
	}
};
