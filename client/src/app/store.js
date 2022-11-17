import { configureStore } from '@reduxjs/toolkit';
import { socketReducer } from '../slices/socketSlice';
import { userReducer } from '../slices/userSlice';
import { chatReducer } from '../slices/chatSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		chat: chatReducer,
		socket: socketReducer
	},
});
