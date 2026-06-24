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

module.exports = {
  getFomoLogs,
  createFomoLog,
};
