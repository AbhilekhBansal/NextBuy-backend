import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from '../models/order.js';
import { invalidateCache, reduceStock } from "../utils/helper.js";
import { orderSchema } from "../validators/Validator.js";


export const newOrder = TryCatch(async (req, res, next) => {

    // Implement logic to create a new order 

    try {
        // validate order
        const validatedData = orderSchema.parse(req.body);

        const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = validatedData;

        await Order.create({ shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total });

        await reduceStock(orderItems);
        invalidateCache({ product: true, order: true, admin: true });
        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
        })

    } catch (error) {
        next(error);
    }
});

export const myOrders = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    let orders = [];

    // Check if the orders are cached
    if (myCache.has(`my-Orders-${user}`)) {
        orders = JSON.parse(myCache.get(`my-Orders-${user}`));
    } else {
        orders = await Order.find({ user });
        myCache.set(`my-Orders-${user}`, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders
    });
});

export const allOrders = TryCatch(async (req, res, next) => {
    let orders;

    // Check if the orders are cached
    if (myCache.has(`all-orders`)) {
        orders = JSON.parse(myCache.get(`all-orders`));
    } else {
        orders = await Order.find({});
        myCache.set(`all-orders`, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders
    });
});