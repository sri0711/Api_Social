const { connect, connection } = require('mongoose');
const config = require('../config/dev');

let url = config.dbConfig.url;
url = url
	.replace('<USER>', process.env.USERNAME)
	.replace('<PASSWORD>', process.env.PASS)
	.replace('<DBNAME>', config.dbConfig.DB_Name);

connect(url, {
	useUnifiedTopology: true,
	useNewUrlParser: true
});

connection.on('connected', () => {
	console.log(
		`${config.dbConfig.DB_Name} database is connected successfully!`
	);
});
