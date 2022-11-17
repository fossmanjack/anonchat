import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as User from '../slices/userSlice';
import { useSocket } from '../app/socket';

export default function ChatBody({ lastMessageRef }) {
	const navigate = useNavigate();
	//const { socket } = useSelector(S => S.socket);
	const { socket } = useSocket();
	const { messages: reduxMsg } = useSelector(S => S.chat);
	const { uid, users } = useSelector(S => S.user);
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
		setMessages([ ...reduxMsg ].sort((a, b) =>
			a.timestamp > b.timestamp ? 1 : a.timestamp < b.timestamp ? -1 : 0
		));
	}, [ reduxMsg, users]);
/*

	useEffect(_ => {
		setMessages([ ...reduxMsg, ...session ].sort((a, b) => {
			let x = a.timestamp;
			let y = b.timestamp;
			return x > y ? 1 : x < y ? -1 : 0;
		}));
		console.log('useEffect msgs:', reduxMsg);
	}, [ reduxMsg, session ]);
*/

	return (
		<>
			<header className='chat__mainHeader'>
				<p>Hangout</p>
				<button className='leaveChat__btn' onClick={handleLeaveChat}>
					Leave Chat
				</button>
			</header>

			<div className='message__container'>
				{ messages.map(msg => {
					const { type, sender, recipient, mid, content } = msg;
					const senderName = users[sender] || 'Unknown';
					const recipientName = users[recipient] || 'Unknown';

					if(type === 'session') return (
						<div className='message__chats' key={mid}>
							<p>Session</p>
							<div className='messageSession'>
								<p>{content}</p>
							</div>
						</div>
					);

					else if(type === 'direct') {
						if(sender === uid) return (
							<div className='message__chats' key={mid}>
								<p className='sender__name'>{`Direct to ${recipientName}`}</p>
								<div className='message__sender'>
									<p>{content}</p>
								</div>
							</div>
						);
						else return (
							<div className='message_chats' key={msg}>
								<p>{`Direct from ${senderName}`}</p>
								<div className='message__recipient'>
									<p>{content}</p>
								</div>
							</div>
						);
					}

					else if(sender === uid) return (
						<div className='message__chats' key={mid}>
							<p className='sender__name'>{senderName}</p>
							<div className='message__sender'>
								<p>{content}</p>
							</div>
						</div>
					);

					else return (
						<div className='message_chats' key={msg.mid}>
							<p>{senderName}</p>
							<div className='message__recipient'>
								<p>{content}</p>
							</div>
						</div>
					);
				})}

				<div ref={lastMessageRef} />
				<div className='message__status'>
					<p>{typingInfo}</p>
				</div>

			</div>
		</>
	);
}
