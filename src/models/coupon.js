import mongoose, { Schema } from "mongoose";
import validator from 'validator';

const schema = new mongoose.Schema({
    coupon: {
        type: String,
        required: [true, "Please enter the Coupon Code"],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, "Please enter the Discount Amount"],

    },

}, { timestamps: true })

export const Coupon = mongoose.model("Coupon", schema);
