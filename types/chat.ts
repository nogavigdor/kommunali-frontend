export interface IMessage {
	senderId: string; // User ID of the sender
	text: string; // Content of the message
	timestamp: number; // UNIX timestamp of the message
}

export interface IChat {
	participants: string[]; // List of participant user IDs
	messages: IMessage[]; // List of messages in the chat
}
