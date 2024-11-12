import express from "express";
import { allOrders, deleteOrder, myOrders, newOrder, orderDetails, processOrder } from "../controllers/order.js";
import { isAdmin } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", newOrder);

app.get("/myOrders", myOrders);
app.get("/all", allOrders);

app.route("/:id").get(orderDetails).put(isAdmin, processOrder).delete(isAdmin, deleteOrder);


export default app;