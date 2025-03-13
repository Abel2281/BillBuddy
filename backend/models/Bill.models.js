import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    splitBetween: [
        {
            type: mongoose.Schemma.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
    isPaid:{
        type: Boolean,
        default: false
    }
});

export const Bill = mongoose.model('Bill', billSchema)