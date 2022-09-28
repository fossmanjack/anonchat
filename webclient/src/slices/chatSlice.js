import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	messages: [],
	session: []
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
		},
		addSession: (cState, action) => {
			// for local notifications
			console.log('addSession:', action);
			return {
				...cState,
				session: [
					...cState.session,
					action.payload
				]
			}
		}
	}
});

export const chatReducer = chatSlice.reducer;

export const {
	addMessage,
	addSession
} = chatSlice.actions;

