import { useSelector } from 'react-redux';

export default function ChatBar() {
	const { username, users } = useSelector(S => S.user);

	return (
		<div className='chat__sidebar'>
			<h2>Open Chat</h2>

			<div>
				<h4 className='chat__header'>Active Users</h4>
				<div className='chat__users'>
					{ Object.keys(users).sort((a, b) => {
							let x = users[a].username;
							let y = users[b].username;

							if(x === username) return -1;
							if(y === username) return 1;

							return x > y ? 1 : x < y ? -1 : 0;
						}).map(userKey => (
						<p key={userKey}>{users[userKey].username}</p>
					))}
				</div>
			</div>
		</div>
	);
}
