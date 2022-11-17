const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

const http = require('http').Server(app);
const PORT = 7777;
// _Users is for clients, _Sockets is for the server
let _Users = {};  // { uid: username, uid: username }
let _Sockets = {}; // { uid: sid, uid: sid }

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
	}

	// uid is "immutable" (once persistence comes online)
	_Users = { ..._Users, [uid]: username };
	_Sockets = { ..._Sockets, [uid]: socket.id };
	socket.uid = uid;
	socket.username = username;

	next();
});

io.on('connection', socket => {
	const { uid, username, id: sid } = socket;
	console.log(`*** ${username} (${uid}) has connected with sid ${sid}`);
	io.emit('userChangeResponse', _Users);

	socket.onAny((event, ...args) => {
		console.log('RECEIVED:\n\tsid:', socket.id, '\n\tevent:', event, '\n\targs:', args);
	});

	socket.on('message', data => {
		io.emit('messageResponse', data);
	});

	socket.on('userChange', data => {
		// expects username
		_Users = { ..._Users, [uid]: data };

		io.emit('userChangeResponse', _Users);
	});

	socket.on('typing', data => {
		io.emit('typingResponse', data);
	});

	socket.on('directMessage', message => {
		socket.to(_Sockets[message.recipient]).emit('directMessage', message);
	});

	socket.on('disconnect', _ => {
		console.log(`>>> ${username} (${sid}) has disconnected`);
		delete _Users[uid];
		_Sockets = { ..._Sockets, [uid]: null };

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
