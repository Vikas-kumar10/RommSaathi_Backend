import express from "express";

import { getUsers, updateUserStatus } from "../controllers/user.controller.js";

// import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getUsers,);
router.patch("/:id/status", updateUserStatus);

export default router;
