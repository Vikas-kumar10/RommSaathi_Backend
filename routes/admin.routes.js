import express from "express";

import {
  getAdminDashboard,
} from "../controllers/admin.controller.js";

//  import authMiddleware from "../middleware/auth.middleware.js";


const router = express.Router();

// Admin dashboard: counts + recent rooms
router.get(
  "/dashboard",
//   authMiddleware,
  
  getAdminDashboard
);

export default router;