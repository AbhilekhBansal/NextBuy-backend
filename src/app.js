import express, { json } from 'express';
import "dotenv/config"
import { connectBD } from './config/connectDB.js';
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from "node-cache";

//importing routes 
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';
import orderRoutes from './routes/order.js';

const port = process.env.PORT || 8000;
connectBD();

export const myCache = new NodeCache();

const app = express();
app.use(json())

// Routes 
app.get('/', (req, res) => {
    myCache.flushAll();
    res.send('Server is live on /api/v1/');
});
// user routes
app.use('/api/v1/user', userRoutes);
// product routes
app.use('/api/v1/product', productRoutes);
// order routes
app.use('/api/v1/order', orderRoutes);

app.use("/uploads", express.static("uploads"));

app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// Global Error middleware
app.use(errorMiddleware)

app.listen(port, () => {
    console.log("server is working in https://localhost:" + port);
})