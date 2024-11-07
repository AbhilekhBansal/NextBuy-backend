import { ZodError } from 'zod';

export const errorMiddleware = (err, req, res, next) => {
    // Handle Zod validation errors
    if (err instanceof ZodError) {
        const validationErrors = err.errors.map((error) => ({
            field: error.path.join('.'),
            message: error.message,
        }));
        return res.status(400).json({
            success: false,
            errors: validationErrors,
        });
    }

    // Handle MongoDB duplicate key error (error code 11000)
    if (err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: `Duplicate key error: ${Object.keys(err.keyValue).join(", ")} already exists.`,
        });
    }

    // General error handling
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong",
    });
};


export const TryCatch = (asyncHandler) => (req, res, next) => {
    return Promise.resolve(asyncHandler(req, res, next)).catch(next);
};
