import { Router } from "express";
import {
  register,
  login,
  logoutUser,
  getUserForPortfolio,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/portfolio/me").get(getUserForPortfolio);
router.route("/update-user").post(verifyJWT, updateUser);

export default router;
