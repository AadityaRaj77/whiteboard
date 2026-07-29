import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
    title: { type: String, default: "Untitled Board" },
    owner: { type: String, required: true },
    sessionId: { type: String, required: true }
}, { timestamps: true });

export const Board = mongoose.model('Board', BoardSchema);