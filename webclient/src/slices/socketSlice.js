import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	hostname: 'localhost:7777',
}

const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		setHostname: (sState, action) => {
			return {
				...sState,
				hostname: action.payload
			}
		}
	}
});

export const socketReducer = socketSlice.reducer;

export const {
	setHostname
} = socketSlice.actions;
