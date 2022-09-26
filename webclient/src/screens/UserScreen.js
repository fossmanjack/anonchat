import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserScreen() {
	const navigate = useNavigate();
	const [ username, setUsername ] = useState('');

	const handleSubmit = e => {
		e.preventDefault();
		localStorage.setItem('username', username);
		navigate('/chat');
	}

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
