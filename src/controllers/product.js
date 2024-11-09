import { TryCatch } from '../middlewares/error.js';
import upload from '../middlewares/multer.js';
import { productSchema } from '../validators/Validator.js';
import { Product } from '../models/product.js';
import fs from 'fs';
import path from 'path';
import { cleanupFiles } from '../utils/helper.js';
import ErrorHandler from '../utils/utility-class.js';


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
            const newProduct = await Product.create({
                name,
                description,
                mrp,
                price,
                stock,
                category: category.toLowerCase(),
                photos
            });

            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: newProduct
            });
        } catch (validationError) {
            next(validationError);
        }
    });
});

export const getLatestProduct = TryCatch(async (req, res, next) => {

    const latestProduct = await Product.find({}).sort({ createdAt: -1 }).limit(5);

    return res.status(200).json({
        success: true,
        Products: latestProduct
    })
});

export const getCategories = TryCatch(async (req, res, next) => {

    const Categories = await Product.distinct('category');

    return res.status(200).json({
        success: true,
        Categories
    })
});


export const getAdminProducts = TryCatch(async (req, res, next) => {

    const latestProduct = await Product.find({});

    return res.status(200).json({
        success: true,
        Products: latestProduct
    })
});
export const getProductDetails = TryCatch(async (req, res, next) => {

    const ProductDetails = await Product.findById(req.params.id);
    if (!ProductDetails) return next(new ErrorHandler("Invalid Product ID", 404));

    return res.status(200).json({
        success: true,
        ProductDetails
    })
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


