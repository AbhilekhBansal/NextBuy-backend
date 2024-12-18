
import { User } from '../models/user.js';
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";

export const isAdmin = TryCatch(async (req, res, next) => {
    const { id } = req.query

    if (!id) return next(new ErrorHandler("Invalid Login!", 401));

    const user = await User.findById(id);
    if (!user) return next(new ErrorHandler("Invalid Id, please try again", 401));


    if (user.role !== "Admin") return next(new ErrorHandler("User don't have access to this route", 403));

    next();

});