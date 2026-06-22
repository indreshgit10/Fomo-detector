const express = require("express");
const router = express.Router();
const { getFomoLogs, createFomoLog } = require("../controllers/fomoController");

// @route   GET /api/fomo/logs
router.get("/logs", getFomoLogs);

// @route   POST /api/fomo/logs
router.post("/logs", createFomoLog);

module.exports = router;
