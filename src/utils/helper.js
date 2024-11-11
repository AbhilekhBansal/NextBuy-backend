import fs from 'fs';
import path from 'path';
import { Product } from '../models/product.js';

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

export const invalidateCache = async (product, admin, order) => {
    if (product) {
        const productKeys = ["latestProduct", "categories", "All-Products"];

        const productIds = await Product.find({}).select("_id");
        productIds.forEach(e => {
            productKeys.push(`prodect-${e._id}`);
        })

        myCache.del(productKeys);
    }
    // if (order) {
    //     const orderKeys = [];
    //     myCache.del();
    // }
    // if (admin) {
    //     const adminKeys = [];
    //     myCache.del();
    // }
};

export const reduceStock = async (orderItems) => {
    orderItems.forEach((order) => {
        const product = Product.findById(order.productId);
        if (product) {
            product.stock -= order.quantity;
            product.save();
        } else {
            throw new Error("Product not found");
        }
    })
};