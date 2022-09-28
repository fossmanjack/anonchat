import SocketIO from 'socket.io-client';
import { useRef, useState, useContext, useEffect, createContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as Chat from '../slices/chatSlice';
import * as User from '../slices/userSlice';

const SocketContext = createContext();

export function SocketProvider(props) {
	const { hostname } = useSelector(S => S.socket);
	const { username, uid } = useSelector(S => S.user);
	const [ socket, setSocket ] = useState(null);
	const dispatch = useDispatch();
	const isLoaded = useRef(false);

	// if hostname changes, update socket
	useEffect(_ => {
		if(isLoaded.current) {
			console.log('Updating socket...');
			hostname && setSocket(SocketIO.connect(hostname));
		} else {
			isLoaded.current = true;
		}
	}, [ hostname ]);

	// trying to put all the response parsing here
	useEffect(_ => {
		if(socket) {
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
		}
	}, [ socket ]);

	return (
		<SocketContext.Provider value={socket}>
			{props.children}
		</SocketContext.Provider>
	);
}

export const useSocket = _ => useContext(SocketContext);
