import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  unLinkFileOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { options } from "../constants.js";

import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (user) => {
  try {
    //const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong when generating access and refresh token"
    );
  }
};

const register = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    summery,
    introduction,
    password,
    portfolioUrl,
    githubUrl,
    linkedinUrl,
  } = req.body;

  const files = req.files;
  console.log("Files ---------", files);

  let avatarCouldinaryResponse = "";
  let resumeCouldinaryResponse = "";

  if (files?.avatar) {
    console.log("IN avatar", files.avatar.tempFilePath);
    avatarCouldinaryResponse = await uploadOnCloudinary(
      files?.avatar.tempFilePath
    );
  }

  if (files?.resume) {
    resumeCouldinaryResponse = await uploadOnCloudinary(
      files?.resume.tempFilePath
    );
  }

  const user = await User.create({
    fullName: fullName?.trim(),
    email: email?.trim(),
    phone: phone?.trim(),
    summery: summery?.trim(),
    introduction: introduction?.trim(),
    password: password?.trim(),
    avatar: {
      publicId: avatarCouldinaryResponse?.public_id,
      url: avatarCouldinaryResponse?.url,
    },
    resume: {
      publicId: resumeCouldinaryResponse?.public_id,
      url: resumeCouldinaryResponse?.url,
    },
    portfolioUrl: portfolioUrl?.trim(),
    githubUrl: githubUrl?.trim(),
    linkedinUrl: linkedinUrl?.trim(),
  });

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while register");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, user, "User registered successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(401, "Email & Password is required");
  }

  const checkUser = await User.findOne({ email });

  if (!checkUser) {
    throw new ApiError(500, "email does not matched");
  }

  const verifiedUser = await checkUser.comparePassword(password);

  if (!verifiedUser) throw ApiError(402, "Password does not matched");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    checkUser
  );

  const user = await User.findById(checkUser._id).select(
    "-password -refreshToken"
  );

  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          accessToken,
          refreshToken,
        },
        "User logged In successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // const options = {
  //   httpOnly: true,
  //   secure: true,
  // };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User logged out successfully"));
});

const getUserForPortfolio = asyncHandler(async (req, res) => {
  const id = "66775c9685bab4a5a4da3476";
  const user = await User.findById(id);
  res
    .status(200)
    .json(new ApiResponse(200, user, "User logged out successfully"));
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(402, "User not found");
  }

  const updateData = {
    fullName: req.body?.fullName || user.fullName,
    email: req.body?.email || user.email,
    phone: req.body?.phone || user.phone,
    summery: req.body?.summery || user.summery,
    introduction: req.body?.introduction || user.introduction,
    portfolioUrl: req.body?.portfolioUrl || user.portfolioUrl,
    githubUrl: req.body?.githubUrl || user.githubUrl,
    linkedinUrl: req.body?.linkedinUrl || user.linkedinUrl,
  };

  if (req?.files && req.files?.avatar) {
    const avatarResponse = await uploadOnCloudinary(
      req.files.avatar?.tempFilePath
    );
    if (!avatarResponse) {
      throw new ApiError(401, "Something went wrong while uploading the image");
    }
    await unLinkFileOnCloudinary(user.avatar?.publicId);
    updateData.avatar = {
      url: avatarResponse.url,
      publicId: avatarResponse.public_id,
    };
  }

  if (req?.files && req.files?.resume) {
    const resumeResponse = await uploadOnCloudinary(
      req.files.resume.tempFilePath
    );
    if (!resumeResponse) {
      throw new ApiError(
        401,
        "Something went wrong while uploading the resume"
      );
    }
    await unLinkFileOnCloudinary(user.resume.publicId);
    updateData.resume = {
      url: resumeResponse.url,
      publicId: resumeResponse.public_id,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(201, updatedUser, "Updated user successfully"));
});

export { register, login, logoutUser, getUserForPortfolio, updateUser };
