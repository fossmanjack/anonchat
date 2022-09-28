import { useSelector } from 'react-redux';

export default function ChatBar() {
	const { users } = useSelector(S => S.user);

	return (
		<div className='chat__sidebar'>
			<h2>Open Chat</h2>

			<div>
				<h4 className='chat__header'>Active Users</h4>
				<div className='chat__users'>
					{ Object.keys(users).map(userKey => (
						<p key={userKey}>{users[userKey].username}</p>
					))}
				</div>
			</div>
		</div>
	);
}
