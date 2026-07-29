import { User } from '../models/User.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.json({ success: false });
            }
        } else {
            const hashed = await bcrypt.hash(password, 10);

            user = new User({
                username,
                password: hashed
            });

            await user.save();
        }

        res.cookie('user', username, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        });

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ success: false });
    }
};