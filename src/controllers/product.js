import { TryCatch } from '../middlewares/error.js';
import upload from '../middlewares/multer.js';
import { productSchema } from '../validators/Validator.js';
import { Product } from '../models/product.js';
import fs from 'fs';
import path from 'path';
import { cleanupFiles } from '../utils/helper.js';
import ErrorHandler from '../utils/utility-class.js';
import { myCache } from '../app.js';

// revidates the product data on new , update, delete and new order


export const getLatestProduct = TryCatch(async (req, res, next) => {
    let products;

    // Check if the latest products are cached
    if (myCache.has("latestProduct")) {
        products = JSON.parse(myCache.get("latestProduct"));
    } else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
        myCache.set("latestProduct", JSON.stringify(products));
    }

    return res.status(200).json({
        success: true,
        latestProduct: products
    })
});

export const getCategories = TryCatch(async (req, res, next) => {
    let categories;

    // Check if the categories are cached
    if (myCache.has("categories")) {
        categories = JSON.parse(myCache.get("categories"));
    } else {
        categories = await Product.distinct('category');
        myCache.set("categories", JSON.stringify(categories));
    }

    return res.status(200).json({
        success: true,
        categories
    })
});


export const getAdminProducts = TryCatch(async (req, res, next) => {

    let products;
    // Check if the latest products are cached
    if (myCache.has("All-Products")) {
        products = JSON.parse(myCache.get("All-Products"));
    } else {
        products = await Product.find({});
        myCache.set("All-Products", JSON.stringify(products));
    }

    return res.status(200).json({
        success: true,
        Products: products
    })
});

export const getProductDetails = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    let ProductDetails;

    // Check if the product details are cached
    if (myCache.has(`Product-${id}`)) {
        ProductDetails = JSON.parse(myCache.get(`Product-${id}`));
    } else {
        ProductDetails = await Product.findById(id);
        if (!ProductDetails) return next(new ErrorHandler("Invalid Product ID", 404));
        myCache.set(`Product-${id}`, JSON.stringify(ProductDetails));
    }

    return res.status(200).json({
        success: true,
        ProductDetails
    })
});

export const newProduct = TryCatch(async (req, res, next) => {

    upload.array('photos', 10)(req, res, async (err) => {
        if (err) {
            return next(err);
        }

        req.body.photos = req.files ? req.files.map(file => file.path) : [];

        req.body.mrp = parseFloat(req.body.mrp);
        req.body.price = parseFloat(req.body.price);
        req.body.stock = parseInt(req.body.stock, 10);


        try {
            const validatedData = productSchema.parse(req.body);
            // Check if photos are uploaded
            if (!req.files || req.files.length === 0) {
                cleanupFiles(req.files); // Delete files if validation fails
                return res.status(400).json({
                    success: false,
                    errors: [{ field: "photos", message: "Please upload at least one photo" }],
                });
            }
            const { name, description, mrp, price, stock, category } = validatedData;
            const photos = req.files.map(file => file.path); // Store file paths

            // Create a new product in the database
            await Product.create({
                name,
                description,
                mrp,
                price,
                stock,
                category: category.toLowerCase(),
                photos
            });
            await invalidateCache({ product: true });
            const products = await Product.find({});

            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: products
            });
        } catch (validationError) {
            next(validationError);
        }
    });
});

export const updateProduct = TryCatch(async (req, res, next) => {

    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return next(new ErrorHandler("Invalid Id", 400));

    const fieldsToUpdate = ["name", "description", "mrp", "price", "stock", "category", "photos"];
    const hasUpdates = fieldsToUpdate.some(field => req.body[field] || req.files?.length);

    if (!hasUpdates) {
        return res.status(400).json({
            success: false,
            message: "At least one field is required for update",
        });
    }

    upload.array('photos', 10)(req, res, async (err) => {
        if (err) {
            return next(err);
        }

        req.body.photos = req.files ? req.files.map(file => file.path) : [];
        req.body.mrp = req.body.mrp ? parseFloat(req.body.mrp) : undefined;
        req.body.price = req.body.price ? parseFloat(req.body.price) : undefined;
        req.body.stock = req.body.stock ? parseInt(req.body.stock, 10) : undefined;

        try {
            const validatedData = productSchema.parse(req.body);

            if (req.files && req.files.length > 0) {
                cleanupFiles(existingProduct.photos.map(photoPath => ({ path: photoPath })));
                existingProduct.photos = req.body.photos;
            }

            if (validatedData.name !== undefined) existingProduct.name = validatedData.name;
            if (validatedData.description !== undefined) existingProduct.description = validatedData.description;
            if (validatedData.mrp !== undefined) existingProduct.mrp = validatedData.mrp;
            if (validatedData.price !== undefined) existingProduct.price = validatedData.price;
            if (validatedData.stock !== undefined) existingProduct.stock = validatedData.stock;
            if (validatedData.category !== undefined) existingProduct.category = validatedData.category.toLowerCase();
            if (validatedData.photos && validatedData.photos.length > 0) existingProduct.photos = validatedData.photos;

            await existingProduct.save();
            await invalidateCache({ product: true });

            res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: existingProduct
            });
        } catch (validationError) {
            cleanupFiles(req.files); // Delete files if a validation error occurs
            next(validationError);
        }
    });
});

export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) return next(new ErrorHandler("Product not found", 404));
    cleanupFiles(product.photos.map(photoPath => ({ path: photoPath })));
    await product.deleteOne();
    await invalidateCache({ product: true });
    return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
    })

});

export const getAllProduct = TryCatch(async (req, res, next) => {

    const { search, category, sort, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = Number(page - 1) * limit;

    const baseQuery = {};

    if (search) {
        baseQuery.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
        ];
    }
    if (category) {
        baseQuery.category = category.toLowerCase();
    }
    if (price) {
        baseQuery.price = { $lt: parseFloat(price) };
    }

    const productPromise = Product.find(baseQuery).sort(sort && { name: sort === "asc" ? 1 : -1 }).limit(limit).skip(skip);

    const [products, filteredProducts] = await Promise.all([productPromise, Product.find(baseQuery)]);

    const totalPages = Math.ceil(filteredProducts.length / limit);
    return res.status(200).json({
        success: true,
        Products: products,
        totalPages: totalPages,
    })
});
