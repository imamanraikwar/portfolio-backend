import { Router } from "express";

import {
  postTimeline,
  getAllTimelines,
  deleteTimeline,
  modifyTimeline,
} from "../controllers/timeline.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-timeline").post(verifyJWT, postTimeline);
router.route("/delete-timeline/:timelineId").delete(verifyJWT, deleteTimeline);
router.route("/modify-timeline/:timelineId").post(verifyJWT, modifyTimeline);
router.route("/getall-timeline").get(getAllTimelines);

export default router;
