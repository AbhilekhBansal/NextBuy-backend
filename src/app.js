import express, { json } from 'express';
import "dotenv/config"
import { connectBD } from './config/connectDB.js';
import { errorMiddleware } from './middlewares/error.js';

//importing routes 
import userRoutes from './routes/user.js';
import productRoutes from './routes/product.js';

const port = process.env.PORT || 8000;
connectBD();

const app = express();
app.use(json())

// Routes 
app.get('/', (req, res) => {
    res.send('Server is live on /api/v1/');
});
// user routes
app.use('/api/v1/user', userRoutes);
// product routes
app.use('/api/v1/product', productRoutes);

// Global Error middleware
app.use(errorMiddleware)

app.listen(port, () => {
    console.log("server is working in https://localhost:" + port);
})