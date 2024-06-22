import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

import { Message } from "../models/message.model.js";

const sendMessage = asyncHandler(async (req, res) => {
  console.log("In send message");
  const { senderName, subject, message } = req.body;

  if ([senderName, subject, message].some((field) => field.trim() === "")) {
    throw new ApiError(401, "Fill the complete form");
  }

  const createdMessage = await Message.create({
    senderName,
    subject,
    message,
  });

  if (!createdMessage) {
    throw new ApiError(501, "Something went wrong while sending the message");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdMessage, "Message send successfully"));
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const validateMessage = await Message.findById(id);

  if (!validateMessage) {
    throw new ApiError(401, "Message already Deleted");
  }

  await validateMessage.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(201, "Message Deleted Successfully"));
});

const getAllMessage = asyncHandler(async (req, res) => {
  const message = await Message.find();

  return res
    .status(200)
    .json(new ApiResponse(201, message, "Message fetch successfully"));
});

export { sendMessage, deleteMessage, getAllMessage };
