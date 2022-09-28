import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as User from '../slices/userSlice';
import { useSocket } from '../app/socket';

export default function ChatBody({ lastMessageRef }) {
	const navigate = useNavigate();
	//const { socket } = useSelector(S => S.socket);
	const socket = useSocket();
	const { messages: storeMsg, session } = useSelector(S => S.chat);
	const [ messages, setMessages ] = useState([]);
	const [ typingInfo, setTypingInfo ] = useState([]);
	const dispatch = useDispatch();

	const handleLeaveChat = _ => {
		dispatch(User.setUsername(''));
		navigate('/');
		window.location.reload();
	};

	useEffect(_ => {
		socket.on('typingResponse', data => setTypingInfo(data));
	}, [ socket ]);

	useEffect(_ => {
		setMessages([ ...storeMsg, ...session ].sort((a, b) => {
			let x = a.timestamp;
			let y = b.timestamp;
			return x > y ? 1 : x < y ? -1 : 0;
		}));
		console.log('useEffect msgs:', storeMsg);
	}, [ storeMsg, session ]);

	return (
		<>
			<header className='chat__mainHeader'>
				<p>Hangout</p>
				<button className='leaveChat__btn' onClick={handleLeaveChat}>
					Leave Chat
				</button>
			</header>

			<div className='message__container'>
				{ messages.map(msg =>
					msg.session
					? (
						<div className='message__chats' key={msg.mid}>
							<p>Session</p>
							<div className='message__recipient'>
								<p>{msg.text}</p>
							</div>
						</div>
					) : (
						msg.sid === socket.id
						? (
							<div className='message__chats' key={msg.mid}>
								<p className='sender__name'>{msg.username}</p>
								<div className='message__sender'>
									<p>{msg.text}</p>
								</div>
							</div>
						) : (
							<div className='message_chats' key={msg.mid}>
								<p>{msg.username}</p>
								<div className='message__recipient'>
									<p>{msg.text}</p>
								</div>
							</div>
						)
					)
				)}

				<div ref={lastMessageRef} />
				<div className='message__status'>
					<p>{typingInfo}</p>
				</div>

			</div>
		</>
	);
}
