import express from "express";

import { isAdmin } from "../middlewares/auth.js";
import { allCoupon, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.js";

const app = express.Router();

app.get("/discount", applyDiscount);

app.get("/coupon/new", newCoupon);
app.get("/coupon/all", allCoupon);
app.get("/coupon/:id", deleteCoupon);


export default app;