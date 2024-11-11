import mongoose, { Schema } from "mongoose";
import validator from 'validator';
import { number } from "zod";

const schema = new mongoose.Schema({
    shippingInfo: {
        street: {
            type: String,
            required: [true, "Please enter shipping address"],

        },
        city: {
            type: String,
            required: [true, "Please enter city"],
        },
        state: {
            type: String,
            required: [true, "Please enter state"],
        },
        country: {
            type: String,
            required: [true, "Please enter country"],
        },
        zip: {
            type: Number,
            required: [true, "Please enter zip code"],
            validate: {
                validator: (zip) => /^[0-9]{6}$/.test(zip),
                message: "{VALUE} is not a valid zip code"
            }
        }
    },
    user: {
        type: String,
        ref: "User",
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        required: true
    },
    shippingCharges: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    orderItems: [
        {
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
            }
        }


    ]
}, { timestamps: true })

export const Order = mongoose.model("Order", schema);
