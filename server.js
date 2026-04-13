require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project-dashboard')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/', require('./routes/auth'));
app.use('/upload', require('./routes/upload'));
app.use('/message', require('./routes/message'));
app.use('/dashboard', require('./routes/dashboard'));

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

});
