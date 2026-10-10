import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
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

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },

    studentUnread: {
      type: Number,
      default: 0,
    },

    ownerUnread: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index(
  { student: 1, owner: 1, room: 1 },
  { unique: true }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;