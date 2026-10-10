import express from "express";

import {
  addRoom,
  getAllRooms,
  getSingleRoom,
  getMyRooms,
  updateRoom,
  deleteRoom,
  getAdminRooms,
  updateRoomApprovalStatus,
  deleteAdminRoom,
} from "../controllers/room.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/* =========================
   ADMIN ROOM ROUTES
   ========================= */

// Get all rooms for Admin
router.get("/admin", getAdminRooms);

// Approve / Reject room
router.patch(
  "/admin/:id/approval",
  updateRoomApprovalStatus
);

// Delete room from Admin
router.delete(
  "/admin/:id",
  deleteAdminRoom
);


/* =========================
   OWNER / PUBLIC ROOM ROUTES
   ========================= */

// Add Room
router.post(
  "/",
  authMiddleware,
  upload.array("images", 5),
  addRoom
);

// Get owner's rooms
router.get(
  "/my-rooms",
  authMiddleware,
  getMyRooms
);

// Get All Rooms
router.get(
  "/",
  getAllRooms
);

// Get Single Room
router.get(
  "/:id",
  getSingleRoom
);

// Update Room
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 5),
  updateRoom
);

// Delete Room
router.delete(
  "/:id",
  authMiddleware,
  deleteRoom
);

export default router;