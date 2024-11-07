import { TryCatch } from '../middlewares/error.js';
import upload from '../middlewares/multer.js';
import { productSchema } from '../validators/Validator.js';


export const newProduct = TryCatch(async (req, res, next) => {
    // Use Multer to handle file upload
    upload.array('photos', 10)(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }

        // Validate request body with Zod schema
        const validatedData = productSchema.parse(req.body);

        // Extract validated data and file paths
        const { name, description, mrp, price, stock, category } = validatedData;
        const photos = req.files.map(file => file.path); // Store the file paths

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
    });
});
