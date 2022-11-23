import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_HOST } from '../localData/defaults';

const initialState = {
	hostname: DEFAULT_HOST,
}

const socketSlice = createSlice({
	name: 'socket',
	initialState,
	reducers: {
		setHostname: (sState, action) => {
			console.log('setHostname:', action.payload);
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
