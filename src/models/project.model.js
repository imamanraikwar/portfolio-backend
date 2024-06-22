import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    gitRepoLink: {
      type: String,
      required: true,
    },
    projectLink: {
      type: String,
    },
    technology: {
      type: String,
      required: true,
    },
    stack: {
      type: String,
      required: true,
    },
    deployed: {
      type: String,
    },
    projectBanner: {
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

export const Project = mongoose.model("Project", projectSchema);
