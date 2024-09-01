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

// ? https://stackoverflow.com/questions/32674391/io-emit-vs-socket-emit#:~:text=emit()%3B%20%2F%2Fsend%20to%20all%20connected%20clients%20except%20the,to%20execute%20on%20server%20io.

io.on('connection', (socket) => {
    //making connection
    console.log(`a user connected: ${socket.id} `);

    socket.on('disconnect', () => {
        console.log(`user with id:${socket.id} disconnected`);
    });

    socket.on('join_room', ({ name, room }, callback) => {

            socket.join(room);

            // socket.emit(`${name} has joined!`);
            io.in(room).emit('server_message', `${name} has joined`);
        socket.on('chat_message', (msg) => {
            //recieving message
            socket.broadcast.to(room).emit('chat_message', msg);
            console.log('message: ' + msg);
        });

        // callback();
    });
});

// io.listen(3000);

server.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
});
