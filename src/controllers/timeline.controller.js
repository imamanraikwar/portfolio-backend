import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

import { Timeline } from "../models/timeline.model.js";

const postTimeline = asyncHandler(async (req, res, next) => {
  const { title, description, from, to } = req.body;
  const newTimeline = await Timeline.create({
    title,
    description,
    timeline: { from, to },
  });
  res
    .status(200)
    .json(new ApiResponse(201, newTimeline, "Timeline created successfully"));
});

const deleteTimeline = asyncHandler(async (req, res, next) => {
  const { timelineId } = req.params;
  let timeline = await Timeline.findById(timelineId);
  if (!timeline) {
    throw new ApiError(401, "Timeline not found");
  }
  await timeline.deleteOne();
  res.status(200).json({
    success: true,
    message: "Timeline Deleted!",
  });
});

const getAllTimelines = asyncHandler(async (req, res, next) => {
  const timelines = await Timeline.find();
  res
    .status(200)
    .json(new ApiResponse(201, timelines, "Timeline send successfully"));
});

const modifyTimeline = asyncHandler(async (req, res) => {
  const { timelineId } = req.params;

  const timeline = await Timeline.findById(timelineId);
  if (!timeline) {
    throw new ApiError(401, "Timeline not found");
  }

  const updateData = {
    title: req.body?.title || timeline.title,
    description: req.body?.description || timeline.description,
    timeline: {
      from: req.body?.from || timeline.timeline.from,
      to: req.body?.to || timeline.timeline.to,
    },
  };

  const updatedTimeline = await Timeline.findByIdAndUpdate(
    timelineId,
    updateData,
    {
      new: true,
      runValidators: false,
    }
  );

  if (!updatedTimeline) {
    throw new ApiError(404, "Something went wrong while updating the timeline");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTimeline, "Application modified successfully")
    );
});

export { postTimeline, getAllTimelines, deleteTimeline, modifyTimeline };
