import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { getAdminProducts, getCategories, getLatestProduct, getProductDetails, newProduct } from "../controllers/product.js";

const app = express.Router();

app.post("/new", newProduct);

app.get("/latest", getLatestProduct);

app.get("/categories", getCategories);

app.get("/admin-products", isAdmin, getAdminProducts);

app.route('/:id').get(getProductDetails)


export default app;