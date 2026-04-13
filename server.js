import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/project-dashboard';
if (!process.env.MONGODB_URI) {
  console.warn('WARNING: MONGODB_URI environment variable is not defined. Falling back to localhost (will fail on Vercel).');
}

mongoose.connect(mongoURI)
.then(() => console.log('Successfully connected to MongoDB'))
.catch(err => {
  console.error('CRITICAL: MongoDB connection error:', err.message);
});

// Routes
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import messageRoutes from './routes/message.js';
import dashboardRoutes from './routes/dashboard.js';

app.use('/', authRoutes);
app.use('/upload', uploadRoutes);
app.use('/message', messageRoutes);
app.use('/dashboard', dashboardRoutes);

// Home route
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found' });
});

export default app;
