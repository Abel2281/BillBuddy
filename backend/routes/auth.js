import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.models.js';

const router = express.Router();

router.post("/register", async (req, res) => {
    const {username, email, phone, password} = req.body;
    try{
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already excists"});

        user = new User({
            username,
            email,
            phone,
            password: await bcrypt.hash(password, 8)
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }
    catch(err){
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post("/login", async (req,res) => {
    const {username, password} = req.body;
    try{
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: "Invalid Username" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) res.status(400).json({msg: "Invalid Password"});

        const token = jwt.sign({ id: user._id}. process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
});

export default router;
