import { Router } from "express";

import {
  addNewSkill,
  deleteSkill,
  updateSkill,
  getAllSkills,
} from "../controllers/skill.controller.js";

const router = Router();

router.route("/addnewskill").post(addNewSkill);
router.route("/deleteskill/:skillId").delete(deleteSkill);
router.route("/updateskill/:skillId").post(updateSkill);
router.route("/getallSkills").get(getAllSkills);

export default router;
