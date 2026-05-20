import { Node } from '../models/Node.js';

export const initSocket = (io) => {
    io.on("connection", (socket) => {

        socket.on("joinBoard", (boardId) => {
            socket.join(boardId);
        });

        socket.on("updateNodes", async ({ boardId, nodes }) => {
            try {
                await Promise.all(nodes.map(node =>
                    Node.findByIdAndUpdate(node._id, node, { upsert: true })
                ));

                socket.to(boardId).emit("updateNodes", nodes);

            } catch (err) {
                console.error(err);
            }
        });

    });
};