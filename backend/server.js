import { createServer } from 'node:http';
import { Server } from 'socket.io';
import app from './app.js';
import { initSocket } from './sockets/socketHandler.js';

const PORT = 3001;

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        credentials: true
    }
});

initSocket(io);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});