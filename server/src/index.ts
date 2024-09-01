import express from 'express';
import { createServer } from 'node:http';
import { PORT } from './constants';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    },
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    //making connection
    console.log(`a user connected: ${socket.id} `);

    socket.on('disconnect', () => {
        console.log(`user with id:${socket.id} disconnected`);
    });

    socket.on('chat_message', (msg) => {
        //recieving message
        socket.broadcast.emit('chat_message', msg);
        console.log('message: ' + msg);
    });
});

// io.listen(3000);

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
