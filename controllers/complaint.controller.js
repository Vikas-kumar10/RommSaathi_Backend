import Complaint from "../models/complaint.model.js";

// =====================================
// CREATE COMPLAINT
// Student / Owner
// =====================================
export const createComplaint = async (req, res) => {
  try {
    const {
      subject,
      description,
      priority,
      relatedRoom,
      relatedRequest,
      relatedVisit,
      relatedUser,
    } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Subject and description are required",
      });
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      userRole: req.user.role,

      subject,
      description,
      priority: priority || "medium",

      relatedRoom: relatedRoom || null,
      relatedRequest: relatedRequest || null,
      relatedVisit: relatedVisit || null,
      relatedUser: relatedUser || null,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit complaint",
    });
  }
};

// =====================================
// GET MY COMPLAINTS
// Student / Owner
// =====================================
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user.id,
    })
      .populate("relatedRoom", "title location rent")
      .populate("relatedUser", "name email phone role")
      .populate("relatedRequest")
      .populate("relatedVisit")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get my complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
    });
  }
};

// =====================================
// GET ALL COMPLAINTS
// Admin
// =====================================
export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({})
      .populate("user", "name email phone role")
      .populate("relatedRoom", "title location rent")
      .populate("relatedUser", "name email phone role")
      .populate("relatedRequest")
      .populate("relatedVisit")
      .populate("resolvedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get all complaints error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaints",
    });
  }
};

// =====================================
// GET SINGLE COMPLAINT
// =====================================
export const getSingleComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email phone role")
      .populate("relatedRoom", "title location rent")
      .populate("relatedUser", "name email phone role")
      .populate("relatedRequest")
      .populate("relatedVisit")
      .populate("resolvedBy", "name email");

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    return res.status(200).json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error("Get single complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch complaint",
    });
  }
};

// =====================================
// UPDATE COMPLAINT STATUS
// Admin
// =====================================
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const allowedStatuses = [
      "pending",
      "investigating",
      "resolved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid complaint status",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    complaint.status = status;

    if (adminNote !== undefined) {
      complaint.adminNote = adminNote;
    }

    if (status === "resolved") {
      complaint.resolvedBy = req.user.id;
      complaint.resolvedAt = new Date();
    } else {
      complaint.resolvedBy = null;
      complaint.resolvedAt = null;
    }

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Update complaint status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update complaint status",
    });
  }
};

// =====================================
// DELETE COMPLAINT
// =====================================
export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error) {
    console.error("Delete complaint error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete complaint",
    });
  }
};