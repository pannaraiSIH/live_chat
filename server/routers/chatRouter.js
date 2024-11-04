import express from "express";
import chatController from "../controllers/chatController.js";
const router = express.Router();

router.get("/", chatController.getChats);

export default router;
