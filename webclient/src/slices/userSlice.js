import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	username: '',
	users: []
}

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUsername: (uState, action) => {
			return {
				...uState,
				username: action.payload
			}
		},
		setUsers: (uState, action) => {
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
