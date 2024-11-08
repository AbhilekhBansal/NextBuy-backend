import { z } from 'zod';

// Define Zod schema for user data validation
export const userSchema = z.object({
    _id: z.string().nonempty("Please enter Id"),
    name: z.string().min(1, "Please enter name").regex(/^[A-Za-z]+$/, "Name should only contain letters"),
    email: z.string().email("Invalid email address"),
    photo: z.string().optional(),
    role: z.enum(['Admin', 'User']).optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    dob: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format")
});

export const productSchema = z.object({
    name: z.string().min(1, "Please enter product name"),
    description: z.string().min(1, "Please enter description"),
    mrp: z.number().min(0, "Please enter a valid MRP"),
    price: z.number().min(0, "Please enter a valid price"),
    stock: z.number().min(0, "Please enter stock quantity"),
    category: z.string().min(1, "Please enter a category"),
});