import express from "express";
import chatController from "../controllers/chatController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, chatController.getChats);

export default router;
