const express = require("express");
const router = express.Router();
const multer = require("multer");
const { getFomoLogs, createFomoLog, uploadFomoLogs } = require("../controllers/fomoController");
const auth = require("../middleware/auth");

// Set up Multer file filter and memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"), false);
    }
  },
});

// @route   GET /api/fomo/logs
// @desc    Get all logs (Protected)
router.get("/logs", auth, getFomoLogs);

// @route   POST /api/fomo/logs
// @desc    Create a new log (Protected)
router.post("/logs", auth, createFomoLog);

// @route   POST /api/fomo/upload
// @desc    Upload CSV logs (Protected)
router.post("/upload", auth, upload.single("file"), uploadFomoLogs);

// @route   GET /api/fomo/stream
// @desc    Real-time SSE stream of FOMO logs (Protected)
router.get("/stream", auth, (req, res) => {
  // Set headers for Server-Sent Events
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { addClient, removeClient } = require("../services/mlService");
  addClient(res);

  // Remove client when connection drops
  req.on("close", () => {
    removeClient(res);
  });
});

module.exports = router;
