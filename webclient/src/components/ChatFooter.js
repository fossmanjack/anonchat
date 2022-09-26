import { useState } from 'react';

export default function ChatFooter({ socket }) {
	const [ message, setMessage ] = useState('');

	const handleSendMessage = e => {
		const user = localStorage.getItem('username');

		e.preventDefault();
		console.log({ user, message });
		if(message.trim() && user) {
			socket.emit('message', {
				user,
				text: message,
				mid: `${socket.id}-${Math.random()}`,
				sid: socket.id,
				timestamp: Date.now()
			});
		}
		setMessage('');
	}

	return (
		<div className='chat__footer'>
			<form className='form' onSubmit={handleSendMessage}>
				<input
					type='text'
					placeholder='Input message here'
					className='message'
					value={message}
					onChange={e => setMessage(e.target.value)}
				/>
				<button className='sendBtn'>Send</button>
			</form>
		</div>
	);
}
