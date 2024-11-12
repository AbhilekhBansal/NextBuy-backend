import express from "express";

import { isAdmin } from "../middlewares/auth.js";
import { allCoupon, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.js";

const app = express.Router();

app.get("/discount", applyDiscount);

app.post("/coupon/new", newCoupon);
app.post("/coupon/all", allCoupon);
app.post("/coupon/:id", deleteCoupon);


export default app;