require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Backend");
});

app.use("/api/fomo", require("./routes/fomo"));

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
