import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../app/socket';
import * as Socket from '../slices/socketSlice';
import * as User from '../slices/userSlice';

export default function UserScreen() {
	const navigate = useNavigate();
	const { username: reduxUser, uid } = useSelector(S => S.user);
	const { hostname: reduxHost } = useSelector(S => S.socket);
	const [ username, setUsername ] = useState(reduxUser);
	const [ hostname, setHostname ] = useState(reduxHost);
	const [ error, setError ] = useState('');
	const dispatch = useDispatch();
	//const socket = useSelector(S => S.socket).socket;
	//const socket = useSocket();
	const { socket, socketError } = useSocket();

	console.log('userScreen:', reduxUser);

	const handleSubmit = e => {
		e.preventDefault();
		console.log(`UserScreen: Submit: ${username} : ${hostname}`);
		if(hostname !== reduxHost) dispatch(Socket.setHostname(hostname));
		if(username !== reduxUser) dispatch(User.setUsername(username));
		//dispatch(User.setUsername(username));
		//localStorage.setItem('username', username);
		//navigate('/chat');
	}

	useEffect(_ => {
		if(reduxUser && socket.onAny) {
			console.log('UserScreen: Attempting to connect with socket', socket.id, 'which has:', socket);
			console.log(`UserScreen: I have the following user data:\n\tUsername: ${reduxUser}\n\tUID: ${uid}`);
			socket.auth = { username: reduxUser, uid };
			socket.connect();
		}
	}, [ reduxUser, socket ]);

	useEffect(_ => {
		console.log(`UserScreen: nav test\n\tSocket: ${socket}\n\tConnected: ${socket.connected}`);
		if(socket && socket.connected) navigate('/chat');
	}, [ socket, socket.connected, navigate ]);

	useEffect(_ => {
		if(socket && socket.error) setError(socket.error);
		else setError('');
	}, [ socket ]);

	return (
		<>
		<form className='home__container' onSubmit={handleSubmit}>
			<h2 className='home__header'>Sign in to open chat...</h2>
			<label htmlFor='username'>Username</label>
			<input
				type='text'
				minLength={6}
				name='username'
				id='username'
				className='username__input'
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			<label htmlFor='hostname'>Host</label>
			<input
				type='text'
				name='hostname'
				id='hostname'
				className='username__input'
				value={hostname}
				onChange={e => setHostname(e.target.value)}
			/>
			<button className='home__cta'>Let's Go!</button>
		</form>
		<p>{error}</p>
		</>
	);
}
