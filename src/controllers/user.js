import { Error } from 'mongoose';
import { TryCatch } from '../middlewares/error.js';
import { User } from '../models/user.js';
import ErrorHandler from '../utils/utility-class.js';

export const newUser = TryCatch(async (req, res, next) => {

    throw new Error('chvsjd');
    const { name, email, photo, gender, _id, dob } = req.body;
    const user = await User.create({ name, email, photo, gender, _id, dob: new Date(dob) });

    return res.status(200).json({
        success: true,
        message: 'User created successfully',

    })

});