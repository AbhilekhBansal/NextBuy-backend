import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { getAdminProducts, getCategories, getLatestProduct, getProductDetails, newProduct, updateProduct } from "../controllers/product.js";

const app = express.Router();

app.post("/new", newProduct);

app.get("/latest", getLatestProduct);

app.get("/categories", getCategories);

app.get("/admin-products", getAdminProducts);

app.route('/:id').get(getProductDetails).put(updateProduct);


export default app;