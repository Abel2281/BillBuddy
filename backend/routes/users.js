import express from "express";
import authenticateToken from "../middleware/auth.js";
import User from "../models/User.models.js"; 

const router = express.Router();

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, "username");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});

router.get("/me", authenticateToken, (req, res) => {
  try {
    res.json({ username: req.user.username }); 
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch user profile" });
  }
});

export default router;