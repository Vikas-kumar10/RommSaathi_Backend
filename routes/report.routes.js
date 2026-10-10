import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createReport,
  getMyReports,
  getAllReports,
  getSingleReport,
  updateReportStatus,
  deleteReport,
} from "../controllers/report.controller.js";

const router = express.Router();

// =====================================
// STUDENT / OWNER
// =====================================

// Create report
router.post("/", authMiddleware, createReport);

// Get logged-in user's reports
router.get("/my", authMiddleware, getMyReports);

// =====================================
// ADMIN
// =====================================

// Get all reports
router.get("/admin", getAllReports);

// Get single report
router.get("/:id", getSingleReport);

// Update report status
router.put("/:id/status", updateReportStatus);

// Delete report
router.delete("/:id", deleteReport);

export default router;