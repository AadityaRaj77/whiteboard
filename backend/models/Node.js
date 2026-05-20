import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema({
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    text: String,
    type: {
        type: String,
        enum: ['idea', 'user', 'feature', 'note'],
        default: 'note'
    },
    position: {
        x: Number,
        y: Number
    },
    links: [String]
}, { timestamps: true });

export const Node = mongoose.model('Node', NodeSchema);