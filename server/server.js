const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const http = require('http').Server(app);
const PORT = 7777;

const io = require('socket.io')(http, {
	cors: {
		origin: "*"
	}
});

io.on('connection', socket => {
	console.log(`***: ${socket.id} user has connected!`);

	socket.on('message', data => {
		console.log(data);
		io.emit('messageResponse', data);
	});

	socket.on('disconnect', _ => {
		console.log(`>>>: ${socket.id} user has disconnected`);
	});
});

app.get('/api', (req, res) => {
	res.json({
		message: 'Greetings, programs!',
	});
});

http.listen(PORT, _ => {
	console.log(`AnonChat server listening on ${PORT}`);
});
