import { TryCatch } from "../middlewares/error";
import { Order } from '../models/order.js';
import { invalidateCache, reduceStock } from "../utils/helper.js";


export const newOrder = TryCatch(async (req, res, next) => {

    // Implement logic to create a new order 
    const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body;

    const order = new Order.create({ shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total });

    await reduceStock(orderItems);
    invalidateCache({ product: true, order: true, admin: true });


});