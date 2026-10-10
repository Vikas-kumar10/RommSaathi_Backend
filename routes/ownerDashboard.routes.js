
import express from "express";
import {
  getOwnerDashboardStats,
} from "../controllers/ownerDashboard.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/dashboard/stats",
  authMiddleware,
  getOwnerDashboardStats
);

export default router;

