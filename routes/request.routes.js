import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createVisitRequest,
  getStudentRequests,
  getOwnerRequests,
  getAllRequestsForAdmin,
  updateRequestStatus,
  deleteRequest,
} from "../controllers/request.controller.js";

const router = express.Router();

// ==========================================
// Student creates visit request
// ==========================================

router.post(
  "/",
  authMiddleware,
  createVisitRequest
);

// ==========================================
// Student gets own requests
// ==========================================

router.get(
  "/student",
  authMiddleware,
  getStudentRequests
);

// ==========================================
// Owner gets requests for own rooms
// ==========================================

router.get(
  "/owner",
  authMiddleware,
  getOwnerRequests
);

// ==========================================
// Admin gets all requests
// Authentication removed
// ==========================================

router.get(
  "/admin",
  getAllRequestsForAdmin
);

// ==========================================
// Owner updates request status
// ==========================================

router.put(
  "/:id/status",
  authMiddleware,
  updateRequestStatus
);

// ==========================================
// Delete request
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  deleteRequest
);

export default router;