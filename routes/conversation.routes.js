import express from "express";

import {
  createOrGetConversation,
  getMyConversations,
} from "../controllers/conversation.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createOrGetConversation
);

router.get(
  "/",
  protect,
  getMyConversations
);

export default router;