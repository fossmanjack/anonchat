import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../app/socket';
import * as Socket from '../slices/socketSlice';

export default function UserScreen() {
	const navigate = useNavigate();
	const { username: reduxUser, uid } = useSelector(S => S.user);
	const { hostname: reduxHost } = useSelector(S => S.socket);
	const [ username, setUsername ] = useState('');
	const [ hostname, setHostname ] = useState(reduxHost);
	const dispatch = useDispatch();
	//const socket = useSelector(S => S.socket).socket;
	const socket = useSocket();

	console.log('userScreen:', reduxUser);

	const handleSubmit = e => {
		e.preventDefault();
		if(hostname !== reduxHost) dispatch(Socket.setHostname(hostname));
		socket.emit('userChange', { uid, username });
		//dispatch(User.setUsername(username));
		//localStorage.setItem('username', username);
		//navigate('/chat');
	}

	useEffect(_ => {
		if(reduxUser) navigate('/chat');
	}, [ reduxUser, navigate ]);

	return (
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
	);
}
