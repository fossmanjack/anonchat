import socketIO from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserScreen from './screens/UserScreen';
import ChatScreen from './screens/ChatScreen';
import { useDispatch } from 'react-redux';
import * as Socket from './slices/socketSlice';

export default function App() {
	useDispatch()(Socket.setSocket(socketIO.connect('http://localhost:7777')));

	return (
		<BrowserRouter>
			<div>
				<Routes>
					<Route path='/' element={<UserScreen />}></Route>
					<Route path='/chat' element={<ChatScreen />}></Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
}
