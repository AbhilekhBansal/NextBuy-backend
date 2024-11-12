import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from '../models/order.js';
import { invalidateCache, reduceStock } from "../utils/helper.js";
import ErrorHandler from "../utils/utility-class.js";
import { orderSchema } from "../validators/Validator.js";


export const newOrder = TryCatch(async (req, res, next) => {

    // Implement logic to create a new order 

    try {
        // validate order
        const validatedData = orderSchema.parse(req.body);

        const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = validatedData;

        const order = await Order.create({ shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total });

        await reduceStock(orderItems);
        invalidateCache({ product: true, order: true, admin: true, userId: user, productId: order.orderItems.map((i) => i.productId) });

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
        orders = await Order.find().populate("user", ["name", "email"]);
        myCache.set(`all-orders`, JSON.stringify(orders));
    }
    return res.status(200).json({
        success: true,
        orders
    });
});

export const orderDetails = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const key = `order-${id}`;
    let order;

    // Check if the orders are cached
    if (myCache.has(key)) {
        order = JSON.parse(myCache.get(key));
    } else {
        order = await Order.findById(id).populate("user", ["name", "email"]);
        if (!order) return next(new ErrorHandler("Order not found", 404));
        myCache.set(key, JSON.stringify(order));
    }
    return res.status(200).json({
        success: true,
        order
    });
});

export const processOrder = TryCatch(async (req, res, next) => {


    try {
        // Implement logic to process an order
        const { id, status = '' } = req.params;

        const order = await Order.findById(id);
        if (!order) return next(new ErrorHandler("Order not found", 404));
        if (status === "Cancel") {
            order.status = "Cancelled";
            order.save();
            return res.status(201).json({
                success: true,
                message: 'Order Cancelled successfully',
            })
        }

        switch (order.status) {
            case "Processing":
                order.status = "Shipped"
                break;
            case "Shipped":
                order.status = "Delivered"
                break;

            default:
                order.status = "Delivered"
                break;
        }

        await order.save();


        invalidateCache({ product: false, order: true, admin: true, userId: order.user });
        return res.status(200).json({
            success: true,
            message: 'Order Processed successfully',
        })

    } catch (error) {
        next(error);
    }
});

export const deleteOrder = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return next(new ErrorHandler("Order not found", 404));

    await order.deleteOne();
    await invalidateCache({ product: false, order: true, admin: true, userId: order.user, orderId: order._id });
    return res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
    })
});
