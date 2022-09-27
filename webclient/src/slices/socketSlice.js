import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	socket: null,
}

const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		setSocket: (sState, action) => {
			return {
				...sState,
				socket: action.payload
			}
		}
	}
});

export const socketReducer = socketSlice.reducer;

export const {
	setSocket,
} = socketSlice.actions;
