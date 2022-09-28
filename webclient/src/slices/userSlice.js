import { v4 as uuidv4 } from 'uuid';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	uid: uuidv4(),
	username: '',
	users: {}
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUsername: (uState, action) => {
			// expects username string as payload
			console.log('setUsername:', action.payload);
			return {
				...uState,
				username: action.payload
			}
		},
		setUsers: (uState, action) => {
			// expects server's _Users object as payload
			console.log('setUsers', action.payload);
			return {
				...uState,
				users: action.payload
			}
		}
	}
});

export const userReducer = userSlice.reducer;

export const {
	setUsername,
	setUsers
} = userSlice.actions;
