require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const { startMLStreamListener } = require("./services/mlService");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Init Middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Backend");
});

// Define Routes
app.use("/api/fomo", require("./routes/fomo"));
app.use("/api/auth", require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
  
  // Start background connection to Python FastAPI server
  startMLStreamListener();
});
