import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChatBar from '../components/ChatBar';
import ChatBody from '../components/ChatBody';
import ChatFooter from '../components/ChatFooter';

export default function ChatScreen() {
	//const { socket } = useSelector(S => S.socket);
	const { messages, session } = useSelector(S => S.chat);
	const lastMessageRef = useRef(null);

	useEffect(_ => {
		lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [ messages, session ]);

/*
	useEffect(_ => {
		socket.on('messageResponse', data => {
			dispatch(Chat.addMessage(data));
		});
	}, [ socket ]);
*/

	return (
		<div className='chat'>
			<ChatBar />
			<div className='chat__main'>
				<ChatBody lastMessageRef={lastMessageRef} />
				<ChatFooter />
			</div>
		</div>
	);
}
