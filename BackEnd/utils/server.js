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
  origin: function (origin, callback) {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    if (!origin) return callback(null, true); // allow requests with no origin
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
  allowedHeaders: "Content-Type,Authorization"
}));

// Define Routes
app.use('/api/auth', require('../src/routes/auth.routes'));
app.use('/api/roles', require('../src/routes/role.routes'));
app.use('/api/fleet-managers', require('../src/routes/fleet-manager.routes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
