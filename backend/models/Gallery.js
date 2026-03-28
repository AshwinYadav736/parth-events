import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
