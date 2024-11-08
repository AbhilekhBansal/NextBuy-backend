import { TryCatch } from '../middlewares/error.js';
import upload from '../middlewares/multer.js';
import { productSchema } from '../validators/Validator.js';
import { Product } from '../models/product.js';


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

    const Product = await Product.findById(req.params.id);

    return res.status(200).json({
        success: true,
        Product
    })
});