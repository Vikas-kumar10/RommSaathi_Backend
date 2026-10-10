import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  getStudentVisits,
  getOwnerVisits,
  getAllVisitsForAdmin,
  getSingleVisit,
  updateVisitStatus,
} from "../controllers/visit.controller.js";

const router = express.Router();

// ==========================================
// Student Visits
// ==========================================

router.get(
  "/student",
  authMiddleware,
  getStudentVisits,
);

// ==========================================
// Owner Visits
// ==========================================

router.get(
  "/owner",
  authMiddleware,
  getOwnerVisits,
);

// ==========================================
// Admin - All Visits
// ==========================================

router.get(
  "/admin",
  getAllVisitsForAdmin,
);

// ==========================================
// Single Visit
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getSingleVisit,
);

// ==========================================
// Update Visit Status
// ==========================================

router.put(
  "/:id/status",
  authMiddleware,
  updateVisitStatus,
);

export default router;