// backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';




dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://chimerical-peony-7266a1.netlify.app',
  //origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);


const PORT = process.env.PORT || 5000;

// Test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log(err));
