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
    name: z.string().min(1, "Please enter product name")
        .regex(/^[a-zA-Z0-9 ]+$/, "Product name should only contain letters, numbers, and spaces").optional(),
    description: z.string().min(1, "Please enter description").optional(),
    mrp: z.number().min(0, "Please enter a valid MRP").optional(),
    price: z.number().min(0, "Please enter a valid price").optional(),
    stock: z.number().min(0, "Please enter stock quantity").optional(),
    category: z.string().min(1, "Please enter a category").optional(),
});