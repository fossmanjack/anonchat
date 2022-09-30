### Message Schema

Each message is an object with the following structure:

{
	type: string, can be 'broadcast', 'direct', or 'session'
	timestamp: int, produced by Date.now()
	sender: string, the uid of the originating client
	mid: string, the sender and timestamp
	content: string, the message content
	recipient: string, optional, the recipient UID (stripped by the server)
}
