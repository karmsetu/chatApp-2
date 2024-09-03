import React from 'react';
import { socket } from './socket';
import { useSearchParams } from 'react-router-dom';
import { MessageBody, ServerMessageBody } from './types';

import './css/chat.css';

function App() {
    const [isConnected, setIsConnected] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [messagesList, setMessgesList] = React.useState<MessageBody[]>([]);
    const [room, setRoom] = React.useState('');
    const [name, setName] = React.useState('');

    const [searchParams] = useSearchParams();

    React.useEffect(() => {
        socket.connect();
        setName(searchParams.get('name') ?? '');
        setRoom(searchParams.get('room') ?? '404');
        console.log({ name, room });

        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.emit('join_room', {
            name: searchParams.get('name'),
            room: searchParams.get('room'),
        });
        socket.on('message', (msg) => {
            setMessgesList((prevArray) => [
                ...prevArray,
                { ...msg, type: 'user' },
            ]);
            console.log(msg);
        });

        socket.on('server_message', (mes) => {
            console.log(mes);
            setMessgesList((prevArray) => [
                ...prevArray,
                { body: mes, type: 'server' },
            ]);
        });

        return () => {
            socket.off('connect', () => setIsConnected(true));
            socket.off('disconnect', () => setIsConnected(false));
            socket.off('message');
            socket.off('join_room');
            socket.off('server_message');
        };
    }, []);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.length) {
            socket.emit('chat_message', message);
            setMessgesList((prevArray) => [
                ...prevArray,
                { body: message, type: 'self' },
            ]);
        }
        setMessage('');
    };

    return (
        <>
            <div className="chat-container">
                <div>connection {isConnected ? 'secured' : 'failed'}</div>
                <div className="chat-messages">
                    {messagesList.map((messageBody, index) => {
                        return (
                            <div
                                key={index}
                                className={`${messageBody.type}-message`}
                            >
                                {messageBody.userName ? (
                                    <span>{messageBody.userName}:</span>
                                ) : messageBody.type === 'user' ? (
                                    'you'
                                ) : null}
                                {messageBody.type === 'server' ? (
                                    <>
                                        <span
                                            style={{
                                                backgroundColor:
                                                    (
                                                        messageBody.body as ServerMessageBody
                                                    ).event === 'joined'
                                                        ? 'blue'
                                                        : 'red',
                                            }}
                                        >
                                            {`${
                                                (
                                                    messageBody.body as ServerMessageBody
                                                ).user
                                            }:${
                                                (
                                                    messageBody.body as ServerMessageBody
                                                ).event
                                            }`}
                                        </span>
                                    </>
                                ) : (
                                    <span>{messageBody.body as string}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
                <form onSubmit={sendMessage} className="chat-input">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        // onKeyUp={(e) => (e.key === 'Enter' ? sendMessage : null)}
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </>
    );
}

export default App;
