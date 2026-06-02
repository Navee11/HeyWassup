import express from "express";
import { protectedRoute } from "../middleware/auth.js";
import {
  getMessages,
  getUsersforSidebar,
  markMessageAsSeen,
  sendMessage,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectedRoute, getUsersforSidebar);
messageRouter.get("/:id", protectedRoute, getMessages);
messageRouter.put("/mark/:id", protectedRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectedRoute, sendMessage);

export default messageRouter;
