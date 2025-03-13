import express from 'express';
import jwt from 'jsonwebtoken';
import Bill from '../models/Bill.models.js';
import User from '../models/User.models.js';

const router = express.Router();

const auth = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.id;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };

  router.get("/", auth, async (req, res) => {
    try {
      const bills = await Bill.find()
        .populate("paidBy", "username")
        .populate("splitBetween", "username");
      res.json(bills);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  });

  router.post("/", auth, async (req, res) => {
    const { description, amount, paidByUsername, splitBetweenUsernames } = req.body;
    try {
      const paidBy = await User.findOne({ username: paidByUsername });
      if (!paidBy) return res.status(400).json({ msg: "Paid By user not found" });
  
      const splitBetween = await User.find({ username: { $in: splitBetweenUsernames } });
      if (splitBetween.length !== splitBetweenUsernames.length) {
        return res.status(400).json({ msg: "Some participants not found" });
      }
  
      const bill = new Bill({
        description,
        amount,
        paidBy: paidBy._id,
        splitBetween: splitBetween.map((user) => user._id),
      });
      await bill.save();
      res.json(bill);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  });

  router.put("/:id", auth, async (req, res) => {
    const { isPaid } = req.body;
    try {
      const bill = await Bill.findById(req.params.id);
      if (!bill) return res.status(404).json({ msg: "Bill not found" });
  
      bill.isPaid = isPaid;
      await bill.save();
      res.json(bill);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  });
  
  export default router;