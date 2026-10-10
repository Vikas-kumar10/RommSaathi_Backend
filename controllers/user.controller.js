import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Request from "../models/request.model.js";

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    // Sirf student ya owner allowed
    if (!role || !["student", "owner"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Valid role is required: student or owner",
      });
    }

    const users = await User.find({
      role,
    })
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // =========================
    // STUDENTS
    // =========================

    if (role === "student") {
      const studentIds = users.map(
        (user) => user._id
      );

      const requestCounts = await Request.aggregate([
        {
          $match: {
            student: {
              $in: studentIds,
            },
          },
        },
        {
          $group: {
            _id: "$student",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      const requestMap = {};

      requestCounts.forEach((item) => {
        requestMap[item._id.toString()] =
          item.count;
      });

      const formattedStudents = users.map(
        (user) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,

          requests:
            requestMap[user._id.toString()] || 0,

          status:
            user.status || "active",
        })
      );

      return res.status(200).json({
        success: true,
        role: "student",
        users: formattedStudents,
      });
    }

    // =========================
    // OWNERS
    // =========================

    if (role === "owner") {
      const ownerIds = users.map(
        (user) => user._id
      );

      const roomCounts = await Room.aggregate([
        {
          $match: {
            owner: {
              $in: ownerIds,
            },
          },
        },
        {
          $group: {
            _id: "$owner",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

      const roomMap = {};

      roomCounts.forEach((item) => {
        roomMap[item._id.toString()] =
          item.count;
      });

      const formattedOwners = users.map(
        (user) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,

          rooms:
            roomMap[user._id.toString()] || 0,

          status:
            user.status || "active",
        })
      );

      return res.status(200).json({
        success: true,
        role: "owner",
        users: formattedOwners,
      });
    }
  } catch (error) {
    console.error(
      "Get users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["active", "blocked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status = status;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        status === "blocked"
          ? "User blocked successfully"
          : "User unblocked successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};