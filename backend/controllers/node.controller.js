import { Node } from '../models/Node.js';

// Create node
export const createNode = async (req, res) => {
    try {
        const { boardId, text, type, position } = req.body;

        const node = new Node({
            boardId,
            text,
            type,
            position
        });

        await node.save();

        res.json({ success: true, node });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};

// Update node
export const updateNode = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const node = await Node.findByIdAndUpdate(id, updates, { new: true });

        res.json({ success: true, node });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};

// Delete node
export const deleteNode = async (req, res) => {
    try {
        const { id } = req.params;

        await Node.findByIdAndDelete(id);

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};