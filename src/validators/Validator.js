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

export const orderSchema = z.object({
    shippingInfo: z.object({
        street: z.string().min(1, "Please enter shipping address"),
        city: z.string().min(1, "Please enter city"),
        state: z.string().min(1, "Please enter state"),
        country: z.string().min(1, "Please enter country"),
        zip: z.string()
            .regex(/^[0-9]{6}$/, { message: "Zip code must be a 6-digit number" }),
    }),
    user: z.string().min(1, "User ID is required"),
    subtotal: z.number({ required_error: "Subtotal is required" }),
    tax: z.number({ required_error: "Tax is required" }).optional(),
    shippingCharges: z.number({ required_error: "Shipping charges are required" }).optional(),
    discount: z.number({ required_error: "Discount is required" }).optional(),
    total: z.number({ required_error: "Total is required" }),
    orderItems: z.array(
        z.object({
            name: z.string(),
            photo: z.string().optional(),
            price: z.number(),
            quantity: z.number().int(),
            productId: z.string().min(1, "Product ID is required"),
        })
    ).nonempty("Order items cannot be empty"),
});


export const couponSchema = z.object({
    coupon: z
        .string({ required_error: "Please enter the coupon code" })
        .min(4, { message: "Coupon code must be at least 4 characters long" })
        .max(20, { message: "Coupon code must be at most 20 characters long" })
    ,
    amount: z
        .number({ required_error: "Please enter an amount" })
        .positive("Amount must be positive")
        .min(1, { message: "Amount must be at least 1" })
        .max(10000, { message: "Amount cannot exceed 10000" }),
});