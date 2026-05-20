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

io.on("connection", (socket) => {

    console.log("user connected");


    socket.on("joinBoard", (boardId) => {

        socket.join(boardId);
    });


    socket.on("nodeCreated", ({ boardId, node }) => {

        socket.to(boardId)
            .emit("nodeCreated", node);
    });


    socket.on("nodeUpdated", ({ boardId, node }) => {

        socket.to(boardId)
            .emit("nodeUpdated", node);
    });


    socket.on("nodeDeleted", ({ boardId, nodeId }) => {

        socket.to(boardId)
            .emit("nodeDeleted", nodeId);
    });


    socket.on("clearCanvas", (boardId) => {

        socket.to(boardId)
            .emit("clearCanvas");
    });


    socket.on("disconnect", () => {

        console.log("user disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});