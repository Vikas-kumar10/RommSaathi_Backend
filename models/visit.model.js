import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
      unique: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    scheduledTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "upcoming",
        "completed",
        "cancelled",
      ],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  },
);

const Visit = mongoose.model("Visit", visitSchema);

export default Visit;