import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";
import { couponSchema } from "../validators/Validator.js";

export const newCoupon = TryCatch(async (req, res, next) => {

    // Validate request body using Zod schema
    const validatedData = couponSchema.parse(req.body);

    // Implement logic to create a new coupon
    const { coupon, amount } = validatedData;

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ coupon });
    if (existingCoupon) {
        return res.status(400).json({
            success: false,
            message: "Coupon already exists"
        });
    }

    // Create a new coupon
    const newCoupon = await Coupon.create({ coupon, amount });
    return res.status(201).json({
        success: true,
        message: `Coupon ${newCoupon.coupon} created successfully`,
    });


});

export const applyDiscount = TryCatch(async (req, res, next) => {

    const { coupon } = req.query;
    const discount = await Coupon.findOne({ coupon });
    if (!discount) return next(new ErrorHandler("Invalid Coupon code", 400));

    return res.status(200).json({
        success: true,
        message: `Coupon ${discount.coupon} applied successfully`,
        discount: discount.amount,
    });

});

export const allCoupon = TryCatch(async (req, res, next) => {
    const coupons = await Coupon.find({});

    return res.status(200).json({
        success: true,
        coupons
    });

});
export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return next(new ErrorHandler("Invalid Coupon ID"), 404);

    await coupon.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Coupon deleted successfully"
    });


});