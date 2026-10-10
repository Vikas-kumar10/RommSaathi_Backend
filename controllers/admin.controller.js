import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Request from "../models/request.model.js";
import Complaint from "../models/complaint.model.js";
import Report from "../models/report.model.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalStudents,
      totalOwners,
      totalRooms,
      totalRequests,
      totalComplaints,
      totalReports,
      recentRooms,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),

      User.countDocuments({ role: "owner" }),

      Room.countDocuments(),

      Request.countDocuments(),

      Complaint.countDocuments(),

      Report.countDocuments(),

      Room.find()
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalOwners,
        totalRooms,
        totalRequests,
        totalComplaints,
        totalReports,
      },
      recentRooms,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};