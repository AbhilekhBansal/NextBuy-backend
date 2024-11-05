import mongoose from 'mongoose';
import validator from 'validator';

const schema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, "Please enter Id"],
    },
    name: {
        type: String,
        required: [true, "Please enter name"],
        validate: {
            validator: validator.isAlpha,
            message: "{VALUE} is not a valid name"
        }
    },
    email: {
        type: String,
        unique: [true, "Enter email is already exist"],
        required: [true, "Please enter email"],
        validate: {
            validator: validator.isEmail,
            message: "{VALUE} is not a valid email"
        }
    },
    photo: {
        type: String,
        required: [true, "Please add a photo"],

    },
    role: {
        type: String,
        enum: ['Admin', 'User'],
        default: 'User'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    dob: {
        type: Date,
        required: [true, "Please enter date of birth"],

    },

}, { timestamps: true });

// virtual field age 
schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    const age = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
})

export const User = mongoose.model('User', schema);

