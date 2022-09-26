import { useNavigate } from 'react-router-dom';

export default function ChatBody({ messages, socket }) {
	const navigate = useNavigate();

	const handleLeaveChat = _ => {
		localStorage.removeItem('userName');
		navigate('/');
		window.location.reload();
	};

	return (
		<>
			<header className='chat__mainHeader'>
				<p>Hangout</p>
				<button className='leaveChat__btn' onClick={handleLeaveChat}>
					Leave Chat
				</button>
			</header>

			<div className='message__container'>
				{ messages.sort((a, b) => {
					let x = a.timestamp;
					let y = b.timestamp;

					return x > y ? 1 : x < y ? -1 : 0;
				}).map(msg =>
					msg.sid === socket.id
					? (
						<div className='message__chats' key={msg.mid}>
							<p className='sender__name'>{msg.user}</p>
							<div className='message__sender'>
								<p>{msg.text}</p>
							</div>
						</div>
					) : (
						<div className='message_chats' key={msg.mid}>
							<p>{msg.user}</p>
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
