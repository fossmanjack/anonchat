import { createSlice } from '@reduxjs/toolkit';
import * as Utils from '../app/utils';

const initialState = {
	messages: [],
	session: [],
	last: ''
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
		},
		setLast: (cState, action) => {
			// last DM received from
			return {
				...cState,
				last: action.payload
			}
		}
	}
});

/*
const newMessage = ({ sid, session, direct, content }) => {
	return {
		timestamp: Date.now(),
		sid,
		session,
		direct,
		mid: `${sid}-${Utils.genuuid(12)}`;

			dispatch(Chat.addSession({
				sid: socket.id,
				username,
				uid,
				text: `*** User ${target} not found!`
*/

export const chatReducer = chatSlice.reducer;

export const {
	addMessage,
	addSession,
	setLast
} = chatSlice.actions;

