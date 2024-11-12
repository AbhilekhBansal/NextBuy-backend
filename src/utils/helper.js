import fs from 'fs';
import path from 'path';
import { Product } from '../models/product.js';
import { myCache } from '../app.js';
import { Order } from '../models/order.js';

// Helper function to delete files
export const cleanupFiles = (files) => {
    if (files && files.length > 0) {
        files.forEach(file => {
            fs.unlink(file.path, (err) => {
                if (err) {
                    console.error(`Failed to delete file ${file.path}:`, err);
                }
            });
        });
    }
};

export const invalidateCache = async (product, admin, order, userId, orderId, productId) => {
    if (product) {
        const productKeys = ["latestProduct", "categories", "All-Products"];
        if (typeof productId === "string") productKeys.push(`prodect-${productId}`);
        if (typeof productId === "object") productId.forEach(key => productKeys.push(`prodect-${productId}`))

        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = ["all-orders", `my-Orders-${userId}`, `order-${orderId}`];

        myCache.del(orderKeys);
    }
    // if (admin) {
    //     const adminKeys = [];
    //     myCache.del();
    // }
};

export const reduceStock = async (orderItems) => {
    for (const order of orderItems) {
        const product = await Product.findById(order.productId);
        if (product) {
            product.stock -= order.quantity;
            await product.save();
        } else {
            throw new Error("Product not found");
        }
    }
};
