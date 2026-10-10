import Room from "../models/room.model.js";
import Request from "../models/request.model.js";

export const getOwnerDashboardStats = async (req, res) => {
  try {
    const ownerId = req.user.id;

    // Check owner role
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only room owners can access dashboard stats.",
      });
    }

    // ==========================================
    // Total Rooms
    // ==========================================

    const totalRooms = await Room.countDocuments({
      owner: ownerId,
    });

    // ==========================================
    // Available Rooms
    // ==========================================

    const availableRooms = await Room.countDocuments({
      owner: ownerId,
      status: "available",
    });

    // ==========================================
    // Pending Requests
    // ==========================================

    const pendingRequests = await Request.countDocuments({
      owner: ownerId,
      status: "pending",
    });

    // ==========================================
    // Accepted Requests
    // ==========================================

    const acceptedRequests = await Request.countDocuments({
      owner: ownerId,
      status: "accepted",
    });

    // ==========================================
    // Response
    // ==========================================

    return res.status(200).json({
      success: true,

      stats: {
        totalRooms,
        availableRooms,
        pendingRequests,
        acceptedRequests,
      },
    });
  } catch (error) {
    console.error(
      "Get owner dashboard stats error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    });
  }
};