// import mongoose from "mongoose";

// const roomSchema = new mongoose.Schema(
//   {
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     description: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     rent: {
//       type: Number,
//       required: true,
//       min: 0,
//     },

//     location: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     roomType: {
//       type: String,
//       enum: ["Single", "Double", "Shared"],
//       required: true,
//     },

//     facilities: {
//       type: [String],
//       default: [],
//     },

//     images: {
//       type: [String],
//       default: [],
//     },

//     status: {
//       type: String,
//       enum: ["available", "rented"],
//       default: "available",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Room = mongoose.model("Room", roomSchema);

// export default Room;

import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    rent: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    roomType: {
      type: String,
      required: true,
      enum: ["Single", "Double", "Shared"],
    },

    images: {
      type: [String],
      default: [],
    },

    facilities: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["available", "rented"],
      default: "available",
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;