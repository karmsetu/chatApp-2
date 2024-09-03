export type MessageBody = {
    type: 'server' | 'user' | 'self';
    userName?: string;
    body: string | ServerMessageBody;
};

export type ServerMessageBody = { user: string; event: 'joined' | 'left' };
