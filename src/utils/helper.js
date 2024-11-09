import fs from 'fs';
import path from 'path';

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
}
