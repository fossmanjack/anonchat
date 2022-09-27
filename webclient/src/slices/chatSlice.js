import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	messages: [],
}

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		addMessage: (cState, action) => {
			console.log('addMessage:', action);
			if(cState.messages.find(msg => msg.mid === action.payload.mid)) return cState;
			return {
				...cState,
				messages: [
					...cState.messages,
					action.payload
				]
			}
		}
	}
});

export const chatReducer = chatSlice.reducer;

export const {
	addMessage
} = chatSlice.actions;

