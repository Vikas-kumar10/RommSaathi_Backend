import Request from "../models/request.model.js";
import Room from "../models/room.model.js";

// ======================================================
// CREATE VISIT REQUEST
// POST /api/requests
// ======================================================

export const createVisitRequest = async (req, res) => {
  try {
    const { roomId, visitDate, visitTime, message } = req.body;

    // --------------------------------------------
    // Validate required fields
    // --------------------------------------------

    if (!roomId || !visitDate || !visitTime) {
      return res.status(400).json({
        success: false,
        message: "Room, visit date and visit time are required",
      });
    }

    // --------------------------------------------
    // Check student role
    // --------------------------------------------

    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can request a room visit",
      });
    }

    // --------------------------------------------
    // Find room
    // --------------------------------------------

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // --------------------------------------------
    // Check room availability
    // --------------------------------------------

    if (room.status !== "available") {
      return res.status(400).json({
        success: false,
        message: "This room is not available",
      });
    }

    // --------------------------------------------
    // Validate visit date
    // --------------------------------------------

    const selectedDate = new Date(visitDate);

    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit date",
      });
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Visit date cannot be in the past",
      });
    }

    // --------------------------------------------
    // Check existing pending request
    // --------------------------------------------

    const existingRequest = await Request.findOne({
      student: req.user.userId,
      room: roomId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request for this room",
      });
    }

    // --------------------------------------------
    // Create request
    // --------------------------------------------

    const request = await Request.create({
      student: req.user.userId,
      owner: room.owner,
      room: room._id,
      visitDate: selectedDate,
      visitTime,
      message: message || "",
    });

    // --------------------------------------------
    // Populate response
    // --------------------------------------------

    const populatedRequest = await Request.findById(request._id)
      .populate("student", "name email phone")
      .populate("owner", "name email phone")
      .populate(
        "room",
        "title description rent location roomType facilities images status",
      );

    return res.status(201).json({
      success: true,
      message: "Visit request sent successfully",
      request: populatedRequest,
    });
  } catch (error) {
    console.error("Create visit request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create visit request",
      error: error.message,
    });
  }
};

// ======================================================
// GET STUDENT REQUESTS
// GET /api/requests/student
// ======================================================

export const getStudentRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      student: req.user.userId,
    })
      .populate("room", "title rent location roomType images status")
      .populate("owner", "name email phone")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get student requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student requests",
      error: error.message,
    });
  }
};

// ======================================================
// GET OWNER REQUESTS
// GET /api/requests/owner
// ======================================================

export const getOwnerRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      owner: req.user.userId,
    })
      .populate("student", "name email phone")
      .populate("room", "title rent location roomType images status")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get owner requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch owner requests",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE REQUEST STATUS
// PUT /api/requests/:id/status
// ======================================================

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // --------------------------------------------
    // Validate status
    // --------------------------------------------

    const allowedStatuses = ["pending", "accepted", "rejected", "completed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request status",
      });
    }

    // --------------------------------------------
    // Find request
    // --------------------------------------------

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // --------------------------------------------
    // Only owner can update request
    // --------------------------------------------

    if (request.owner.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this request",
      });
    }

    request.status = status;

    await request.save();

    const updatedRequest = await Request.findById(request._id)
      .populate("student", "name email phone")
      .populate("owner", "name email phone")
      .populate("room", "title rent location roomType images status");

    return res.status(200).json({
      success: true,
      message: "Request status updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    console.error("Update request status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update request status",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE REQUEST
// DELETE /api/requests/:id
// ======================================================

export const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // --------------------------------------------
    // Student or owner can delete their request
    // --------------------------------------------

    const userId = req.user.userId.toString();

    const isStudent = request.student.toString() === userId;

    const isOwner = request.owner.toString() === userId;

    if (!isStudent && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this request",
      });
    }

    await Request.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    console.error("Delete request error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete request",
      error: error.message,
    });
  }
};

/*------------------- */

// ==========================================
// Admin gets all requests
// ==========================================

export const getAllRequestsForAdmin = async (req, res) => {
  try {
    const requests = await Request.find({})
      .populate("student", "name email phone")
      .populate("owner", "name email phone")
      .populate("room", "title location rent")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error("Get all requests error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch all requests",
    });
  }
};
