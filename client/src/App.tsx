import React from 'react';
import { socket } from './socket';
import { useSearchParams } from 'react-router-dom';

function App() {
    const [isConnected, setIsConnected] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [messagesList, setMessgesList] = React.useState<string[]>([]);
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
        socket.on('chat_message', (msg) => {
            setMessgesList((prevArray) => [...prevArray, msg]);
        });
        return () => {
            socket.off('connect', () => setIsConnected(true));
            socket.off('disconnect', () => setIsConnected(false));
            socket.off('chat_message');
            socket.off('join_room');
        };
    }, []);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.length) socket.emit('chat_message', message);
        setMessage('');
    };

    return (
        <>
            <div>connection {isConnected ? 'secured' : 'failed'}</div>
            {messagesList.map((msg, index) => {
                return <div key={index}>{msg}</div>;
            })}
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    // onKeyUp={(e) => (e.key === 'Enter' ? sendMessage : null)}
                />
                <button type="submit">Send</button>
            </form>
        </>
    );
}

export default App;
