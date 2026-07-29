import { Board } from '../models/Board.js';
import { Node } from '../models/Node.js';
import { v4 as uuidv4 } from 'uuid';

// Create board
export const createBoard = async (req, res) => {
    try {
        const user = req.cookies.user || "test-user";

        const board = new Board({
            owner: user,
            sessionId: uuidv4()
        });

        await board.save();

        res.json({ success: true, board });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Get board + nodes
export const getBoard = async (req, res) => {
    try {
        const { id } = req.params;

        const board = await Board.findById(id);
        const nodes = await Node.find({ boardId: id });

        res.json({ success: true, board, nodes });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};