import multer from 'multer';
import path, { extname } from 'path';
import { v4 as uuidv4 } from "uuid";

// Set the storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // You can set the destination folder here
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uid = uuidv4();
        // Set a custom filename for the uploaded file
        cb(null, uid + extname(file.originalname));
    }
});

// Create the Multer upload middleware
const upload = multer({ storage });

export default upload;
