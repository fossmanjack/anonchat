import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as User from '../slices/userSlice';

export default function UserScreen() {
	const navigate = useNavigate();
	const reduxUser = useSelector(S => S.user).username;
	const [ username, setUsername ] = useState('');
	const dispatch = useDispatch();

	console.log('userScreen:', reduxUser);

	const handleSubmit = e => {
		e.preventDefault();
		dispatch(User.setUsername(username));
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
			<button className='home__cta'>Let's Go!</button>
		</form>
	);
}
