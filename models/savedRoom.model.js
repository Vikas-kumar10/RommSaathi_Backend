import mongoose from "mongoose";

const savedRoomSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Same student same room ko multiple times save nahi kar sakta
savedRoomSchema.index(
  { student: 1, room: 1 },
  { unique: true }
);

const SavedRoom = mongoose.model("SavedRoom", savedRoomSchema);

export default SavedRoom;