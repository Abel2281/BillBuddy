import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 0,
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  splitBetween: [
    {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Bill", billSchema); 