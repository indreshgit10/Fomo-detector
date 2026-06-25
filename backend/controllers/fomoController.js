const FomoLog = require("../models/FomoLog");

// @desc    Get all FOMO logs
// @route   GET /api/fomo/logs
// @access  Public
const getFomoLogs = async (req, res) => {
  try {
    const logs = await FomoLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Create a new FOMO log entry
// @route   POST /api/fomo/logs
// @access  Public
const createFomoLog = async (req, res) => {
  try {
    const { alpha, beta, theta, gamma, attention, scroll_speed, prediction } = req.body;

    const newLog = new FomoLog({
      alpha,
      beta,
      theta,
      gamma,
      attention,
      scroll_speed,
      prediction,
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Upload historical CSV logs
// @route   POST /api/fomo/upload
// @access  Private (Protected by auth)
const uploadFomoLogs = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV file" });
    }

    const fileContent = req.file.buffer.toString("utf8");
    const lines = fileContent.split(/\r?\n/);
    if (lines.length < 2) {
      return res.status(400).json({ message: "CSV file is empty or missing data" });
    }

    // Extract headers (e.g. alpha, beta, theta, gamma, attention, scroll_speed, prediction)
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const logs = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map((v) => v.trim());
      if (values.length !== headers.length) continue;

      const logData = {};
      headers.forEach((header, index) => {
        logData[header] = parseFloat(values[index]);
      });

      // Validation check
      if (
        isNaN(logData.alpha) ||
        isNaN(logData.beta) ||
        isNaN(logData.theta) ||
        isNaN(logData.gamma) ||
        isNaN(logData.attention) ||
        isNaN(logData.scroll_speed) ||
        isNaN(logData.prediction)
      ) {
        continue; // Skip invalid rows
      }

      logs.push(logData);
    }

    if (logs.length === 0) {
      return res.status(400).json({ message: "No valid log entries found in CSV" });
    }

    // Bulk save to MongoDB
    const savedLogs = await FomoLog.insertMany(logs);
    res.status(201).json({
      message: `Successfully uploaded and saved ${savedLogs.length} logs`,
      count: savedLogs.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getFomoLogs,
  createFomoLog,
  uploadFomoLogs,
};
