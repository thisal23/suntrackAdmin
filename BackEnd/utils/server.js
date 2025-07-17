require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const { connectDB } = require('../src/config/database');
const initializeDatabase = require('../src/config/init-db');
const cors = require("cors");

// Connect to database and initialize tables
(async () => {
  try {
    await connectDB();
    await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
})();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend origin
  methods: "GET,POST,PUT,DELETE",  // Allowed HTTP methods
  credentials: true,               // Allow cookies/session handling
  allowedHeaders: "Content-Type,Authorization"
}));

// Define Routes
app.use('/api/auth', require('../src/routes/auth.routes'));
app.use('/api/roles', require('../src/routes/role.routes'));
app.use('/api/fleet-managers', require('../src/routes/fleet-manager.routes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
