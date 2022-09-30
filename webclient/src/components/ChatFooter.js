import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Chat from '../slices/chatSlice';
import { useSocket } from '../app/socket';
import * as Utils from '../app/utils';

export default function ChatFooter() {
	const [ msgTxt, setMsgTxt ] = useState('');
	const reduxState = useSelector(S => S);
	const dispatch = useDispatch();
	//const { socket } = useSelector(S => S.socket);
	const { socket, socketError } = useSocket();
	const { uid, username, users } = useSelector(S => S.user);
	const { last } = useSelector(S => S.chat);

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
				const timestamp = Date.now();

				socket.emit('message', {
					type: 'broadcast',
					sender: uid,
					timestamp,
					mid: `${uid}-${timestamp.toString(16)}`,
					content: msgTxt
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
			case '/reply': case '/re':
				handleReply(args);
				break;
			default:
				let timestamp = Date.now();

				dispatch(Chat.addMessage({
					type: 'session',
					sender: uid,
					timestamp,
					mid: `${uid}-${timestamp.toString(16)}`,
					content: `*** ${command} is not a valid command!`
				}));
		}
	}

	const handleNickChange = args => {
		const [ newNick, ...rest ] = args;

		if(newNick === username) return;
		else {
			let timestamp = Date.now();
			socket.emit('userChange', { uid, username: newNick });
			dispatch(Chat.addMessage({
				type: 'session',
				sender: uid,
				timestamp,
				mid: `${uid}-${timestamp.toString(16)}`,
				content: `*** You have changed your nick from ${username} to ${newNick}`
			}));
		}
	}

	const handleDM = args => {
		const [ target, ...rest ] = args;
		const timestamp = Date.now();

		if(!rest.length) {
			dispatch(Chat.addMessage({
				type: 'session',
				sender: uid,
				timestamp,
				mid: `${uid}-${timestamp.toString(16)}`,
				content: '*** You must provide a message to send!'
			}));
			return;
		}

		const tuid = Object.keys(users).find(key => users[key] === target);

		if(!tuid) {
			dispatch(Chat.addMessage({
				type: 'session',
				sender: uid,
				timestamp,
				mid: `${uid}-${timestamp.toString(16)}`,
				content: `*** User ${target} not found!`
			}));
			return;
		}

		const content = rest.join(' ');
		const message = {
			type: 'direct',
			sender: uid,
			recipient: tuid,
			timestamp,
			mid: `${uid}-${timestamp.toString(16)}`,
			content
		};

		socket.emit('directMessage', message);
		dispatch(Chat.addMessage(message));
	}

	const handleReply = args => {
		const timestamp = Date.now();
		console.log('handleReply:', args);
		if(!last) {
			dispatch(Chat.addMessage({
				type: 'session',
				sender: uid,
				timestamp,
				mid: `${uid}-${timestamp.toString(16)}`,
				content: `*** You haven't received any DMs!`
			}));
			return;
		}

		if(!Object.keys(users).includes(last)) {
			dispatch(Chat.addMessage({
				type: 'session',
				sender: uid,
				timestamp,
				mid: `${uid}-${timestamp.toString(16)}`,
				content: `*** The recipient is no longer online`
			}));
			return;
		}

		const message = {
			type: 'direct',
			sender: uid,
			recipient: last,
			timestamp,
			mid: `${uid}-${timestamp.toString(16)}`,
			content: args.join(' ')
		};

		socket.emit('directMessage', message);
		dispatch(Chat.addMessage(message));
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
