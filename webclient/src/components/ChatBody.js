import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as User from '../slices/userSlice';

export default function ChatBody() {
	const navigate = useNavigate();
	const { socket } = useSelector(S => S.socket);
	const { messages: storeMsg } = useSelector(S => S.chat);
	const [ messages, setMessages ] = useState([]);
	const dispatch = useDispatch();

	const handleLeaveChat = _ => {
		dispatch(User.setUsername(''));
		navigate('/');
		window.location.reload();
	};

	useEffect(_ => {
		setMessages([ ...storeMsg ].sort((a, b) => {
			let x = a.timestamp;
			let y = b.timestamp;
			return x > y ? 1 : x < y ? -1 : 0;
		}));
		console.log('useEffect msgs:', storeMsg);
	}, [ storeMsg ]);

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
				)}

				<div className='message__status'>
					<p>Someone is typing ...</p>
				</div>

			</div>
		</>
	);
}
