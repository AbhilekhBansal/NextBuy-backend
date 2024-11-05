import express, { json } from 'express';

//importing routes 
import userRoutes from './routes/user.js';
import { connectBD } from './utils/connectDB.js';
import { errorMiddleware } from './middlewares/error.js';

const port = 5000;
connectBD();

const app = express();
app.use(json())

app.get('/', (req, res) => {
    res.send('Server is live on /api/v1/');
});

app.use('/api/v1/user', userRoutes);

app.use(errorMiddleware)

app.listen(port, () => {
    console.log("server is working in https://localhost:" + port);
})