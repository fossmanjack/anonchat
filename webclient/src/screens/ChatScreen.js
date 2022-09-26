import { useEffect, useState } from 'react';
import ChatBar from '../components/ChatBar';
import ChatBody from '../components/ChatBody';
import ChatFooter from '../components/ChatFooter';

export default function ChatScreen({ socket }) {
	const [ messages, setMessages ] = useState([]);

	useEffect(_ => {
		socket.on('messageResponse', data => {
			setMessages([ ...messages, data ])
		});
	}, [ socket, messages ]);

	return (
		<div className='chat'>
			<ChatBar socket={socket} />
			<div className='chat__main'>
				<ChatBody messages={messages} socket={socket} />
				<ChatFooter socket={socket} />
			</div>
		</div>
	);
}
