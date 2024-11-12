import mongoose, { Schema } from "mongoose";
import validator from 'validator';

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        unique: true,
        validate: {
            validator: (name) => /^[a-zA-Z0-9 ]+$/.test(name),
            message: "{VALUE} is not a valid name"
        }
    },
    photos: {
        type: [String],  // Changed from String to an array of strings
        required: [true, "Please enter at least one photo"],
        validate: {
            validator: (photos) => photos.length > 0,
            message: "At least one photo is required"
        }

    },
    mrp: {
        type: Number,
        required: [true, "Please enter MRP"],
        validate: {
            validator: (mrp) => mrp > 0,
            message: "{VALUE} is not a valid MRP"
        }
    },
    price: {
        type: Number,
        required: [true, "Please enter price"],
        validate: {
            validator: (price) => price > 0,
            message: "{VALUE} is not a valid price"
        }
    },
    description: {
        type: String,
        required: [true, "Please enter description"],
        trim: true,
        maxlength: [300, "Description should not exceed 250 characters"]
    },
    stock: {
        type: Number,
        required: false, // Make it optional
        validate: {
            validator: function (stock) {
                return stock === undefined || stock >= 0; // Ensure it's either undefined or a valid number
            },
            message: "{VALUE} is not a valid stock"
        }
    },
    category: {
        type: String,
        required: [true, "Please enter category"],
        trim: true,
    },
    sizes: {
        type: Object,
        required: false
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", schema);
