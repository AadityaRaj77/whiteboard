import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import { User } from './models/User.js'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser';

import { Server } from 'socket.io';
import { createServer } from 'node:http'

configDotenv()

const API_URL = import.meta.env.VITE_BACKEND_URL;
const app = express()
const server = createServer(app)
const PORT = 3001

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
})

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

async function connectToDB() {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Mongoose connected");
    } catch (err) {
        console.error("Connection error:", err);
    }
}

connectToDB();

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const existingUser = await User.findOne({ username })

    if (existingUser) {
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (isMatch) {
            res.cookie('user', username, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });
            res.json({ success: true, type: 'login' })
        } else {
            res.json({ success: false, type: 'login' })
        }
    } else {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ username: username, password: hashedPassword })
        await newUser.save()

        res.cookie('user', username, { httpOnly: true, maxAge: 72 * 60 * 60 * 1000 });
        res.json({ success: true, type: 'register' })
    }
})

app.get('/whiteboard', (req, res) => {
    const user = req.cookies.user;
    // console.log(req.)
    if (!user) {
        return res.json({ success: false })
    } else {
        res.json({ success: true, user })
    }
})

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinSession", (sessionId) => {
        socket.join(sessionId);
        console.log(`User joined session: ${sessionId}`);
    });

    socket.on("updateLines", ({ sessionId, data }) => {
        socket.to(sessionId).emit("updateLines", data);
    });

    socket.on("updateRectangles", ({ sessionId, data }) => {
        socket.to(sessionId).emit("updateRectangles", data);
    });

    socket.on("updateCircles", ({ sessionId, data }) => {
        socket.to(sessionId).emit("updateCircles", data);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})
