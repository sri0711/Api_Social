const express = require('express');
const io = require('socket.io')();
const morgan = require('morgan');
const http = require('http');
var envs = process.env.NODE_ENV || 'development';
if (envs === 'development') {
	const env = require('dotenv');
	env.config({ path: './config/config.env' });
}
const tokenChecker = require('../helpers/tokenchecker.js');
const app = express();
const port = process.env.PORT || 8000;
const cors = require('cors');
const server = http.createServer(app);
require('../db/mongo');

// main configurations
app.use(express.json());
app.use(morgan('tiny'));
app.use(tokenChecker);
app.use(
	cors({
		origin: ['http://localhost:3000']
	})
);

// main routes
const main = require('../routes/index');
const user = require('../routes/user');
io.listen(server);

let chanel = 1001
// server listening area
io.on('connection', function (socket) {
	socket.join('new')
	let news;
	console.log('socket connected successfully');
	socket.on(chanel, (data) => {
		news = data + ' from server';
		socket.to(data.room).emit(chanel, data.data);
	});

	socket.emit('own', 'data');
});

app.use('/', main);
app.use('/user', user);


app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).send('Something broke!');
});
server.listen(port, () => {
	console.log('server is started on https://localhost:', port);
});
