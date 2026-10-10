import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getSingleComplaint,
  updateComplaintStatus,
  deleteComplaint,
} from "../controllers/complaint.controller.js";

const router = express.Router();

// =====================================
// STUDENT / OWNER
// =====================================

// Create complaint
// Student/Owner login required
router.post("/", authMiddleware, createComplaint);

// Logged-in user's complaints
// Student/Owner login required
router.get("/my", authMiddleware, getMyComplaints);

// =====================================
// ADMIN
// =====================================

// Get all complaints
// No authentication required
router.get("/admin", getAllComplaints);

// Get single complaint
// No authentication required
router.get("/:id", getSingleComplaint);

// Update complaint status
// No authentication required
router.put("/:id/status", updateComplaintStatus);

// Delete complaint
// No authentication required
router.delete("/:id", deleteComplaint);

export default router;