import socketIO from 'socket.io-client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserScreen from './screens/UserScreen';
import ChatScreen from './screens/ChatScreen';

export default function App() {
	const socket = socketIO.connect('http://localhost:7777');
	// why does it connect twice
	console.log(socket.id);

	return (
		<BrowserRouter>
			<div>
				<Routes>
					<Route path='/' element={<UserScreen socket={socket} />}></Route>
					<Route path='/chat' element={<ChatScreen socket={socket} />}></Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
}
