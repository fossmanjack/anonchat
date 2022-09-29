import SocketIO from 'socket.io-client';
import { useRef, useState, useContext, useEffect, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Chat from '../slices/chatSlice';
import * as User from '../slices/userSlice';

const SocketContext = createContext();

export function SocketProvider(props) {
	const { hostname } = useSelector(S => S.socket);
	const { username, uid, users } = useSelector(S => S.user);
	// don't make it a null connection or we get constant server error events, not sure exactly why
	//const [ socket, setSocket ] = useState(SocketIO.io(hostname, { autoConnect: false }));
	const [ socket, setSocket ] = useState({}); // needs to be an object or stuff breaks elsewhere
	const [ socketError, setSocketError ] = useState({}); // see above
	//const [ socketError, setSocketError ] = useState(null);
	const dispatch = useDispatch();
	const isLoaded = useRef(false);

	// if hostname changes, update socket
	useEffect(_ => {
		if(isLoaded.current) {
			console.log('Updating socket:', hostname);
			//hostname && setSocket(SocketIO.connect(hostname));
			// instead let's control the connection manually when the user is
			// logged in
			hostname && setSocket(SocketIO.io(hostname, { autoConnect: false }));
		} else {
			isLoaded.current = true;
		}
	}, [ hostname ]);

	// trying to put all the response parsing here
	useEffect(_ => {
		if(socket.onAny) {
			// catch-all listener
			socket.onAny((event, ...args) => {
				console.log('socket onAny:', event, args);
			});

			socket.on('connect_error', err => {
				console.log('connect_error:', err);
				//if(err.message.substring(0, 0) === 'U') {
				if(err.message[0] === 'U') {
					console.log('Socket Error:', err.message);
					dispatch(User.setUsername(''));
					setSocketError(err);
				}
			});

			socket.on('messageResponse', data => {
				console.log('messageResponse', data);
				dispatch(Chat.addMessage(data));
			});

			socket.on('userChangeResponse', data => {
				// returns server's _Users object
				console.log('userChangeResponse', data);
				dispatch(User.setUsers(data));

				// if our username has changed, update it
				// NOTE: if the server has { uid: username, uid: username } and we
				// keep a local copy of that object, there's no real need to store
				// an independent username variable
				if(data[socket.id][username] !== username) {
					console.log('username changed!', data, socket.id)
					dispatch(User.setUsername(data[socket.id].username));
				}
			});

			socket.on('directMessage', ({ from, text }) => {
				const sender = users[from].username;
				const sendID = users[from].uid;

				dispatch(Chat.addMessage({
					session: false,
					direct: true,
					sid: from,
					mid: `${from}-${Math.random()}`,
					timestamp: Date.now(),
					username: sender,
					uid: sendID,
					text: `<<< From @${sender}: ${text}`
				}));
			});
		}
	}, [ socket ]);

	return (
		<SocketContext.Provider value={{ socket, socketError }}>
			{props.children}
		</SocketContext.Provider>
	);
}

export const useSocket = _ => useContext(SocketContext);
