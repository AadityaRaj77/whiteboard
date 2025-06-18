import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import { User } from './models/User.js'

configDotenv()

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// let conn = await mongoose.connect(process.env.DB_URI)

app.post('/login', (req, res) => {
    res.send('hello')
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})