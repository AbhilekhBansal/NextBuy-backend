import express from "express";
import { allOrders, myOrders, newOrder } from "../controllers/order.js";

const app = express.Router();

app.post("/new", newOrder);

app.get("/myOrders", myOrders);
app.get("/all", allOrders);


export default app;