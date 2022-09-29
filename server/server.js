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

// auth middleware
io.use((socket, next) => {
	const { username, uid } = socket.handshake.auth;
	if(!username || !uid) {
		console.log('USER ERROR:', username, uid);
		return next(new Error('U01: Username and uid required!'));
	//} else if(Object.values(_Users).find(val => val.username === username)) {
	} /*else if(Object.values(_Users).find(val => val.username === username)) {
		key = Object.keys(_Users).find(key => _Users[key].username === username);
		if(key !== socket.id) {
			console.log('DUPLICATE USER:', username, key, socket.id);
			return next(new Error('U02: Username already in use!'));
		}
	} */
	else {
		socket.username = username;
		socket.uid = uid;
		_Users = { ..._Users, [socket.id]: { uid, username }};
		next();
	}
});

io.on('connection', socket => {
	console.log(`***: ${socket.id} user has connected!`);
	io.emit('userChangeResponse', _Users);

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

	socket.on('directMessage', ({ tid, text }) => {
		socket.to(tid).emit('directMessage', {
			from: socket.id,
			text
		});
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
