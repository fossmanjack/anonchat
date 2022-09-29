import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Chat from '../slices/chatSlice';
import { useSocket } from '../app/socket';

export default function ChatFooter() {
	const [ msgTxt, setMsgTxt ] = useState('');
	const reduxState = useSelector(S => S);
	const dispatch = useDispatch();
	//const { socket } = useSelector(S => S.socket);
	const { socket, socketError } = useSocket();
	const { uid, username, users } = useSelector(S => S.user);

	const handleTyping = _ => {
		if(msgTxt) socket.emit('typing', `${username} is typing...`);
		else socket.emit('typing', '');
	}

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
			case '/msg':
				handleDM(args);
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

	const handleDM = args => {
		const [ target, ...text ] = args;

		const tid = Object.keys(users).find(key => users[key].username === target);
		if(!tid) {
			dispatch(Chat.addSession({
				session: true,
				sid: socket.id,
				mid: `${socket.id}-${Math.random()}`,
				timestamp: Date.now(),
				username,
				uid,
				text: `*** User ${target} not found!`
			}));
		} else {
			socket.emit('directMessage', { tid, text });
			dispatch(Chat.addMessage({
				session: false,
				direct: true,
				sid: socket.id,
				mid: `${socket.id}-${Math.random()}`,
				timestamp: Date.now(),
				username,
				uid,
				text: `>>> You to @${target}: ${text}`
			}));
		}
	}

	const handleDump = _ => {
		console.log('Dumping redux state:', reduxState);
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
					onBlur={handleTyping}
				/>
				<button className='sendBtn'>Send</button>
			</form>
			<button onClick={handleDump}>Dump</button>
			<p>{socketError.message}</p>
		</div>
	);
}
