import { TryCatch } from '../middlewares/error.js';
import { User } from '../models/user.js';
import ErrorHandler from '../utils/utility-class.js';
import { userSchema } from '../validators/Validator.js';


export const newUser = TryCatch(async (req, res, next) => {

    // Validate request body with Zod schema
    const validatedData = userSchema.parse(req.body);

    // Use validated data to create a new user
    const { name, email, photo, gender, _id, dob } = validatedData;

    let user = await User.findById(_id);
    if (user) {
        return res.status(200).json({
            success: true,
            message: 'User successfully Login',
        });
    }
    user = await User.create({ name, email, photo, gender, _id, dob: new Date(dob) });

    return res.status(200).json({
        success: true,
        message: 'User created successfully',

    })

});

// get all users
export const getAllUsers = TryCatch(async (req, res) => {
    const users = await User.find({});
    return res.status(200).json({
        success: true,
        users
    });
});

// get user
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));


    return res.status(200).json({
        success: true,
        user
    });
});

// delete user
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Invalid Id", 400));

    await User.deleteOne();
    return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
    });

}); 
