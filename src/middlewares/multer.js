import multer from 'multer';
import path from 'path';

// Set the storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // You can set the destination folder here
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Set a custom filename for the uploaded file
        cb(null, file.originalname);
    }
});

// Create the Multer upload middleware
const upload = multer({ storage });

export default upload;
