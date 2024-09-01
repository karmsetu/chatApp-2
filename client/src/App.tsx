import React from 'react';
import { socket } from './socket';

function App() {
    const [isConnected, setIsConnected] = React.useState<boolean>(false);
    const [message, setMessage] = React.useState<string>('');
    const [messagesList, setMessgesList] = React.useState<string[]>([]);

    React.useEffect(() => {
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('chat_message', (msg) => {
            setMessgesList((prevArray) => [...prevArray, msg]);
        });
        return () => {
            socket.off('connect', () => setIsConnected(true));
            socket.off('disconnect', () => setIsConnected(false));
            socket.off('chat_message');
        };
    }, []);

    const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        socket.emit('chat_message', message);
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
