import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import { deleteProduct, getAdminProducts, getAllProduct, getCategories, getLatestProduct, getProductDetails, newProduct, updateProduct } from "../controllers/product.js";

const app = express.Router();

app.post("/new", isAdmin, newProduct);

app.get("/all", getAllProduct);

app.get("/latest", getLatestProduct);

app.get("/categories", getCategories);

app.get("/admin-products", isAdmin, getAdminProducts);

app.route('/:id').get(getProductDetails).put(isAdmin, updateProduct).delete(isAdmin, deleteProduct);


export default app;