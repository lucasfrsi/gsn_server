require('dotenv').config();
const express = require('express');
const connectDB = require('./config/connectDB');

const usersRoutes = require('./routes/api/users');

// Creates an Express Application
const app = express();

// Initialize Express "body-parser" Middleware
app.use(express.json());

// Routes
app.use('/api/users', usersRoutes);

// 404 Route
// app.use();

// Connect to MongoDB Atlas, if successful then listen for connections
const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`Server started on port ${PORT}.`)));
