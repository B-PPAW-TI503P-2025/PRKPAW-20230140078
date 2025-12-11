const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");
require("dotenv").config();
const path = require('path'); 

// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const ruteBuku = require("./routes/books"); // Moved here for consistency

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- FIX IS HERE ---
// Serve folder 'uploads' as static files so frontend can access http://localhost:3001/uploads/filename.jpg
// This MUST be before routes to ensure it catches the request
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
// -------------------

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// Routes
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});