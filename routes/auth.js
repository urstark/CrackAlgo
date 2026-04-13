import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', register);

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', login);

router.get('/logout', logout);

export default router;