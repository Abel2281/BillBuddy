import express from "express";
import authenticateToken from "../middleware/auth.js"; 
import Bill from "../models/Bill.models.js";
import User from "../models/User.models.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; 
    const bills = await Bill.find({
      $or: [
        { paidBy: userId },              
        { splitBetween: userId },    
      ],
    })
      .populate("paidBy", "username")
      .populate("splitBetween", "username");
    res.json(bills);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/", authenticateToken, async (req, res) => {
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
      date: new Date(), // Explicitly set
      isPaid: false, // Explicitly set
    });
    await bill.save();
    const populatedBill = await Bill.findById(bill._id)
      .populate("paidBy", "username")
      .populate("splitBetween", "username");
    res.json(populatedBill);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { isPaid } = req.body;
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ msg: "Bill not found" });

    bill.isPaid = isPaid;
    await bill.save();
    const updatedBill = await Bill.findById(bill._id)
      .populate("paidBy", "username")
      .populate("splitBetween", "username");
    res.json(updatedBill);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;