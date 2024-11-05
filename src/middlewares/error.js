export const errorMiddleware = (err, req, res, next) => {

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong"
    })
}

export const TryCatch = (asyncHandler) => (req, res, next) => {
    return Promise.resolve(asyncHandler(req, res, next)).catch(next);
};
