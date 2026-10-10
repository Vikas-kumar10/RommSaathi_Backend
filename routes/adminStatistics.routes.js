import express from "express";

import {
  getPlatformStatistics,
} from "../controllers/adminStatistics.controller.js";

const router = express.Router();

// =====================================
// PLATFORM STATISTICS
// =====================================

router.get("/", getPlatformStatistics);

export default router;