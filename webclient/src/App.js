import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import UserScreen from './screens/UserScreen';
import ChatScreen from './screens/ChatScreen';
import { SocketProvider } from './app/socket';

export default function App() {

	return (
		<SocketProvider>
			<BrowserRouter>
				<div>
					<Routes>
						<Route path='/' element={<UserScreen />}></Route>
						<Route path='/chat' element={<ChatScreen />}></Route>
					</Routes>
				</div>
			</BrowserRouter>
		</SocketProvider>
	);
}
