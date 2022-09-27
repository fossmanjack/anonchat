import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Chat from '../slices/chatSlice';

export default function ChatFooter() {
	const [ msgTxt, setMsgTxt ] = useState('');
	const dispatch = useDispatch();
	const { socket } = useSelector(S => S.socket);
	const { username } = useSelector(S => S.user);

	const handleSendMessage = e => {
		//const user = localStorage.getItem('username');

		e.preventDefault();
		console.log({ username, msgTxt });
		if(msgTxt.trim() && username) {
			socket.emit('message', {
				username,
				text: msgTxt,
				mid: `${socket.id}-${Math.random()}`,
				sid: socket.id,
				timestamp: Date.now()
			});
		}
		setMsgTxt('');
	}

	return (
		<div className='chat__footer'>
			<form className='form' onSubmit={handleSendMessage}>
				<input
					type='text'
					placeholder='Input message here'
					className='message'
					value={msgTxt}
					onChange={e => setMsgTxt(e.target.value)}
				/>
				<button className='sendBtn'>Send</button>
			</form>
		</div>
	);
}
