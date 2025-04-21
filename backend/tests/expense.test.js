import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import expenseRoutes from '../routes/expenseRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/expenses', expenseRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('GET /api/expenses', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Not authorized, no token');
  });
});
