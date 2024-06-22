import { Router } from "express";
import {
  addNewProject,
  updateProject,
  deleteProject,
  getAllProject,
  getOneProject,
} from "../controllers/project.controller.js";

const router = Router();
router.route("/addnewproject").post(addNewProject);
router.route("/updateproject/:id").post(updateProject);
router.route("/deleteproject/:id").delete(deleteProject);
router.route("/getallproject").get(getAllProject);
router.route("/getoneproject/:id").get(getOneProject);

export default router;
