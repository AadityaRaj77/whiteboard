import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.DB_URI)
    .then(() => console.log("DB connected"))
    .catch(err => console.error(err));