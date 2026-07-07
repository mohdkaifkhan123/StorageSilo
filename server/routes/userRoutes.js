import { Router } from "express";
import { protect } from "../middleware/protect.js";
import { logoutUser } from "../controller/userController.js";
const router = Router();

router.post("/logout", protect, logoutUser);

export default router;
