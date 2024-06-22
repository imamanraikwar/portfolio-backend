import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

import {
  uploadOnCloudinary,
  unLinkFileOnCloudinary,
} from "../utils/cloudinary.js";

import { Project } from "../models/project.model.js";

const addNewProject = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    gitRepoLink,
    projectLink,
    technology,
    stack,
    deployed,
  } = req.body;

  let cloudinaryBannerResponse = "";

  if (req.files?.bannerImage) {
    cloudinaryBannerResponse = await uploadOnCloudinary(
      req.files?.bannerImage.tempFilePath
    );
  }

  const createdProject = await Project.create({
    title: title?.trim(),
    description: description?.trim(),
    gitRepoLink: gitRepoLink.trim(),
    projectLink: projectLink?.trim(),
    technology: technology?.trim(),
    stack: stack?.trim(),
    deployed: deployed,
    projectBanner: {
      publicId: cloudinaryBannerResponse?.public_id,
      url: cloudinaryBannerResponse?.url,
    },
  });

  if (!createdProject) {
    throw new ApiError(501, "Something went wrong while creating project");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdProject, "project Created successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const projectData = {
    title: req.body?.title.trim() || project.title,
    description: req.body?.description.trim() || project.description,
    gitRepoLink: req.body?.gitRepoLink.trim() || project.gitRepoLink,
    projectLink: req.body?.projectLink?.trim() || project?.projectLink,
    technology: req.body?.technology?.trim() || project.technology,
    stack: req.body?.stack?.trim() || project.stack,
    deployed: req.body?.deployed?.trim() || project.deployed,
  };

  if (req.body?.files && req.body.files?.bannerImage) {
    const couldinaryBannerResponse = await uploadOnCloudinary(
      req.body.files.bannerImage.tempFilePath
    );

    if (!cloudinaryBannerResponse) {
      throw new ApiError(401, "Something went wrong while uploading the Image");
    }

    await unLinkFileOnCloudinary(project.publicId);
    projectData["projectBanner"] = {
      publicId: cloudinaryBannerResponse.public_id,
      url: cloudinaryBannerResponse.url,
    };
  }

  const newproject = await Project.findByIdAndUpdate(id, projectData, {
    new: true,
    runValidators: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(2011, newproject, "Project Updated Successfully"));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(402, "project Id is required");
  }
  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    throw new ApiError(500, "Something went wrong while delete the project");
  }

  await unLinkFileOnCloudinary(project.bannerImage.publicId);

  return res
    .status(200)
    .json(new ApiResponse(201, "Project Deleted Successfully"));
});

const getAllProject = asyncHandler(async (req, res) => {
  const projects = await Project.find();

  return res
    .status(200)
    .json(new ApiResponse(201, projects, "All project send successfully"));
});

const getOneProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params?.id);

  return res
    .status(200)
    .json(new ApiResponse(201, project, "project send successfully"));
});

export {
  addNewProject,
  updateProject,
  deleteProject,
  getAllProject,
  getOneProject,
};
