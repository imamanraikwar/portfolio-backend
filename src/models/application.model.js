import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    svg: {
      publicId: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
