require('dotenv').config({ path: './config/.env' });
const path = require('path');
const express = require('express');
const connectDB = require('./config/connectDB');
const { createError, handleError } = require('./middleware/helpers/error');

// Routes Require
const authRoutes = require('./routes/api/authRoutes');
const usersRoutes = require('./routes/api/usersRoutes');
const momentsRoutes = require('./routes/api/momentsRoutes');
const postsRoutes = require('./routes/api/postsRoutes');

// Create an Express Application
const app = express();

// Initialize Express "body-parser" Middleware
app.use(express.json());

// Middleware to serve files
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// Set Headers and allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(200).send();
    // Workaround for now, instead of using a CORS package or implementing it according to CORS specifications
  } else {
    next();
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/moments', momentsRoutes);
app.use('/api/posts', postsRoutes);

// 404 Route
app.use(() => {
  throw createError(404, 'Route not found.');
});

// Custom Error Handler Middleware
app.use((err, req, res, next) => {
  handleError(err, req, res, next);
});

// Connect to MongoDB Atlas, if successful then the server listen for connections
const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server started on port ${PORT}.`)));
