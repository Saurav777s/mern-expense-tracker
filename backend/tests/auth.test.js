import request from 'supertest';
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from '../routes/userRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/users', userRoutes);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // clean up
  await mongoose.disconnect();
});

describe('POST /api/users/login', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'StrongPass1!',
  };

  beforeAll(async () => {
    await request(app).post('/api/users/register').send(testUser);
  });

  it('should return token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.email).toBe(testUser.email);
  });

  it('should return 400 for wrong password', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testUser.email, password: 'WrongPassword' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Invalid email or password/i);
  });
});
