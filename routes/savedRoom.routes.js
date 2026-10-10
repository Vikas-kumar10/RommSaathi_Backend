import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  saveRoom,
  getSavedRooms,
  removeSavedRoom,
  checkSavedRoom,
} from "../controllers/savedRoom.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getSavedRooms);

router.post("/:roomId", authMiddleware, saveRoom);

router.get(
  "/check/:roomId",
  authMiddleware,
  checkSavedRoom
);

router.delete(
  "/:roomId",
  authMiddleware,
  removeSavedRoom
);

export default router;