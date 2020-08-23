require('dotenv').config({ path: './config/.env' });
const express = require('express');
const connectDB = require('./config/connectDB');
const { createError, handleError } = require('./middleware/helpers/error');

const usersRoutes = require('./routes/api/usersRoutes');
const momentsRoutes = require('./routes/api/momentsRoutes');
const postsRoutes = require('./routes/api/postsRoutes');

// Create an Express Application
const app = express();

// Initialize Express "body-parser" Middleware
app.use(express.json());

// Set Headers and allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/moments', momentsRoutes);
app.use('/api/posts', postsRoutes);

// 404 Route
app.use(() => {
  throw createError(404, 'Route not found.');
});

// Custom Error Handler Middleware
app.use((err, req, res, next) => {
  handleError(err, res, next);
});

// Connect to MongoDB Atlas, if successful then the server listen for connections
const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server started on port ${PORT}.`)));
