import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

import {
  uploadOnCloudinary,
  unLinkFileOnCloudinary,
} from "../utils/cloudinary.js";

import { Skill } from "../models/skill.model.js";

const addNewSkill = asyncHandler(async (req, res) => {
  if (!req.files || !req.files.svg) {
    throw new ApiError(402, "skill Image are required");
  }

  const coludninaryResponse = await uploadOnCloudinary(
    req.files.svg.tempFilePath
  );
  const newSkill = {
    title: req.body?.title?.trim(),
    proficiency: req.body?.proficiency?.trim(),
    svg: {
      publicId: coludninaryResponse?.public_id,
      url: coludninaryResponse?.url,
    },
  };

  const addSkill = await Skill.create(newSkill);
  if (!addSkill) {
    throw new ApiError(401, "Something went wrong while adding the skill");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, addSkill, "Skill added successfully"));
});

const deleteSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  // Find the skill by ID
  const skill = await Skill.findById(skillId);

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  // Delete the SVG from Cloudinary
  const deleteResponse = await unLinkFileOnCloudinary(skill.svg.publicId);

  if (!deleteResponse.result === "ok") {
    throw new ApiError(500, "Failed to delete image from Cloudinary");
  }

  // Delete the skill from the database
  await Skill.findByIdAndDelete(skillId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Skill deleted successfully"));
});

const updateSkill = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  // Find the existing skill by ID
  const skill = await Skill.findById(skillId);

  if (!skill) {
    throw new ApiError(404, "Skill not found");
  }

  // Update fields from request body
  skill.title = req.body?.title?.trim() || skill.title;
  skill.proficiency = req.body?.proficiency?.trim() || skill.proficiency;

  // If a new SVG file is provided, upload it to Cloudinary
  if (req.files && req.files.svg) {
    // Delete the old SVG from Cloudinary
    await unLinkFileOnCloudinary(skill.svg.publicId);

    // Upload the new SVG to Cloudinary
    const coludninaryResponse = await uploadOnCloudinary(
      req.files.svg.tempFilePath
    );

    // Update the SVG field in the skill document
    skill.svg.publicId = coludninaryResponse?.public_id;
    skill.svg.url = coludninaryResponse?.url;
  }

  // Save the updated skill to the database
  const updatedSkill = await skill.save();

  if (!updatedSkill) {
    throw new ApiError(500, "Something went wrong while updating the skill");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSkill, "Skill updated successfully"));
});

const getAllSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find();

  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Skills retrieved successfully"));
});

export { addNewSkill, deleteSkill, updateSkill, getAllSkills };
