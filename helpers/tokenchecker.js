const commonRoutes = ['/'];
module.exports = (req, res, next) => {
	const routePath = String(req.originalUrl).toLowerCase();
	const token = req.headers['x-access-token'] || req.headers['authorization'];
	if (token) {
		if (token.startsWith('Bearer')) {
			next();
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
