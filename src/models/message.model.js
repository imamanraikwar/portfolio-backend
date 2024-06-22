import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      minLength: [2, "Sender Name at least 2 character"],
    },
    subject: String,
    message: String,
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
