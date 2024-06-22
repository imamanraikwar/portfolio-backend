import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  unLinkFileOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

import { Application } from "../models/application.model.js";

const addApplication = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!req.files?.svg) {
    throw new ApiError(401, "Svg Image is required");
  }

  const svgResponse = await uploadOnCloudinary(req.files.svg?.tempFilePath);

  if (!svgResponse) {
    throw new ApiError(401, "Something went wrong while uploading the image");
  }
  if (!name) {
    // Validate required fields
    throw new ApiError(400, "Name is required");
  }

  const newApplication = await Application.create({
    name: name,
    svg: {
      publicId: svgResponse.public_id,
      url: svgResponse.url,
    },
  });

  if (!newApplication) {
    throw new ApiError(
      401,
      "Something went wrong while creating the application"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, newApplication, "Application added successfully")
    );
});

const deleteApplication = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const deletedApplication = await Application.findByIdAndDelete(projectId);

  if (!deletedApplication) {
    throw new ApiError(404, "Application not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedApplication,
        "Application deleted successfully"
      )
    );
});

const modifyApplication = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Application.findById(projectId);
  if (!project) {
    throw new ApiError(401, "Project not found");
  }

  const updateData = {
    name: req.body?.name || project.name,
  };

  if (req?.files && req.files?.svg) {
    const response = await uploadOnCloudinary(req.files.svg.tempFilePath);
    if (!response) {
      throw new ApiError(401, "Something went wrong while uploading the image");
    }
    await unLinkFileOnCloudinary(project.svg.publicId);
    updateData.svg = {
      publicId: response.public_id,
      url: response.url,
    };
  }

  const updatedApplication = await Application.findByIdAndUpdate(
    projectId,
    updateData,
    {
      new: true,
      runValidators: false,
    }
  );

  if (!updatedApplication) {
    throw new ApiError(404, "Application not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedApplication,
        "Application modified successfully"
      )
    );
});

const getAllApplication = asyncHandler(async (req, res) => {
  const applications = await Application.find();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        applications,
        "All applications retrieved successfully"
      )
    );
});

export {
  getAllApplication,
  modifyApplication,
  deleteApplication,
  addApplication,
};
