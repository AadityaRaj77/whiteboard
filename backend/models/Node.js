import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema(

    {

        boardId: {

            type: String,

            required: true,
        },

        text: {

            type: String,

            required: true,
        },

        type: {

            type: String,

            default: "idea",
        },

        position: {

            x: {

                type: Number,

                required: true,
            },

            y: {

                type: Number,

                required: true,
            },
        },

        links: [

            {
                type: mongoose.Schema.Types.ObjectId,

                ref: "Node",
            },
        ],
    },

    {
        timestamps: true,
    }
);

export const Node =
    mongoose.model(
        "Node",
        NodeSchema
    );