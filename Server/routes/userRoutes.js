import express from "express";
import {
  checkAuth,
  login,
  signUp,
  updateProfile,
} from "../controllers/userControllers.js";
import { protectedRoute } from "../middleware/auth.js";
const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.put("/updateProfile", protectedRoute, updateProfile);
userRouter.get("/check", protectedRoute, checkAuth);

export default userRouter;
