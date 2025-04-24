import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/delete', protect, deleteUser);

// ✅ Add this reset password route
router.post('/reset', async (req, res) => {
  const { email } = req.body;

  // Simulate email check
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Simulate success response
  return res.status(200).json({ message: 'Reset link sent (simulated)' });
});

export default router;

