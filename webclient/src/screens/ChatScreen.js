import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ChatBar from '../components/ChatBar';
import ChatBody from '../components/ChatBody';
import ChatFooter from '../components/ChatFooter';
import * as Chat from '../slices/chatSlice';

export default function ChatScreen() {
	const { socket } = useSelector(S => S.socket);
	const dispatch = useDispatch();

	useEffect(_ => {
		socket.on('messageResponse', data => {
			dispatch(Chat.addMessage(data));
		});
	}, [ socket ]);

	return (
		<div className='chat'>
			<ChatBar />
			<div className='chat__main'>
				<ChatBody />
				<ChatFooter />
			</div>
		</div>
	);
}
