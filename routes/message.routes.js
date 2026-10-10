import express from "express";

import {
  sendMessage,
  getConversationMessages,
} from "../controllers/message.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  sendMessage
);

router.get(
  "/:conversationId",
  protect,
  getConversationMessages
);

export default router;