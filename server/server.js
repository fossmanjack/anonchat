const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const http = require('http').Server(app);
const PORT = 7777;
let _Users = {}; // { socket.id: { uid, username }, socket.id: { uid, username } }

const io = require('socket.io')(http, {
	cors: {
		origin: "*"
	}
});

io.on('connection', socket => {
	console.log(`***: ${socket.id} user has connected!`);

	socket.on('message', data => {
		console.log('message:', data);
		io.emit('messageResponse', data);
	});

	socket.on('userChange', data => {
		console.log('userChange:', data);

		// expects { uid, username }
		_Users = { ..._Users, [socket.id]: data };

		io.emit('userChangeResponse', _Users);
	});

	socket.on('typing', data => {
		console.log('typing:', data);
		io.emit('typingResponse', data);
	});

	socket.on('disconnect', _ => {
		console.log(`>>>: ${socket.id} user has disconnected`);
		delete _Users[socket.id];

		io.emit('userChangeResponse', _Users);
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
