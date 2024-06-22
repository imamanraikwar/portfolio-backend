import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  sendMessage,
  deleteMessage,
  getAllMessage,
} from "../controllers/message.controller.js";

const router = Router();

router.route("/send-message").post(sendMessage);
router.route("/delete/:id").delete(verifyJWT, deleteMessage);
router.route("/getall-message").get(getAllMessage);

export default router;
