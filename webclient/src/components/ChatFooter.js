import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Chat from '../slices/chatSlice';
import { useSocket } from '../app/socket';

export default function ChatFooter() {
	const [ msgTxt, setMsgTxt ] = useState('');
	const dispatch = useDispatch();
	//const { socket } = useSelector(S => S.socket);
	const socket = useSocket();
	const { uid, username } = useSelector(S => S.user);

	const handleTyping = _ => socket.emit('typing', `${username} is typing...`);

	const handleSendMessage = e => {
		//const user = localStorage.getItem('username');

		e.preventDefault();
		console.log({ username, msgTxt });
		if(msgTxt.trim() && username) {
			if(msgTxt[0] === '/') handleCommand();
			else {
				socket.emit('message', {
					session: false,
					uid,
					username,
					text: msgTxt,
					mid: `${socket.id}-${Math.random()}`,
					sid: socket.id,
					timestamp: Date.now()
				});
			}
		}
		socket.emit('typing', '');
		setMsgTxt('');
	}

	const handleCommand = _ => {
		console.log('Command detected:', msgTxt);

		const [ command, ...args ] = msgTxt.split(' ');

		switch(command) {
			case '/nick':
				handleNickChange(args);
				break;
			default:
				dispatch(Chat.addSession({
					session: true,
					sid: socket.id,
					mid: `${socket.id}-${Math.random()}`,
					timestamp: Date.now(),
					username,
					uid,
					text: `*** ${command.substring(1)} is not a valid command!`
				}));
		}
	}

	const handleNickChange = args => {
		const [ newNick, ...rest ] = args;

		if(newNick === username) return;
		else {
			socket.emit('userChange', { uid, username: newNick });
			dispatch(Chat.addSession({
				session: true,
				sid: socket.id,
				mid: `${socket.id}-${Math.random()}`,
				timestamp: Date.now(),
				username,
				uid,
				text: `*** You have changed your nick from ${username} to ${newNick}`
			}));
		}
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
					onKeyDown={handleTyping}
				/>
				<button className='sendBtn'>Send</button>
			</form>
		</div>
	);
}
