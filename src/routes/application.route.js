import { Router } from "express";

import {
  getAllApplication,
  modifyApplication,
  deleteApplication,
  addApplication,
} from "../controllers/application.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-application").post(verifyJWT, addApplication);
router
  .route("/delete-application/:projectId")
  .delete(verifyJWT, deleteApplication);
router
  .route("/modify-application/:projectId")
  .post(verifyJWT, modifyApplication);
router.route("/getall-application").get(getAllApplication);

export default router;
