require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;
const connectDB = require('../config/db'); // Assuming you have a database connection file
const cors = require("cors");
connectDB;
const userRoutes = require('../routes/userRoutes');


// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend origin
  methods: "GET,POST,PUT,DELETE",  // Allowed HTTP methods
  credentials: true,               // Allow cookies/session handling
  allowedHeaders: "Content-Type,Authorization"
}));

// // Define Routes
// app.use('/api/auth', require('../routes/authRoutes'));
// app.use('/api', liveTrackingRoutes);
// app.use('/api', geoRoutes);
// app.use('/api',maintenanceRoutes)
app.use('/api', userRoutes);
// app.use('/api', vehicleRoutes)
// app.use('/api', tripRoutes) 
// app.use('/api',geoFenceEventRoutes);
// app.use('/api',mapRouteHistory);
// app.use('/api',geoFenceReportRoutes);
// app.use('/api',dailySummaryRoutes);
// app.use('/api',dailydetailRoutes);
// app.use('/api', distanceRoutes);
// app.use('/api', idleReportRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
