import Visit from "../models/visit.model.js";

// ==========================================
// Get Student Visits
// ==========================================

export const getStudentVisits = async (req, res) => {
  try {
    const visits = await Visit.find({
      student: req.user.id,
    })
      .populate("owner", "name email phone")
      .populate("room", "title location rent image")
      .populate("request", "message")
      .sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    console.error("Get student visits error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch student visits",
    });
  }
};

// ==========================================
// Get Owner Visits
// ==========================================

export const getOwnerVisits = async (req, res) => {
  try {
    const visits = await Visit.find({
      owner: req.user.id,
    })
      .populate("student", "name email phone")
      .populate("room", "title location rent image")
      .populate("request", "message")
      .sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    console.error("Get owner visits error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch owner visits",
    });
  }
};

// ==========================================
// Get All Visits - Admin
// ==========================================

export const getAllVisitsForAdmin = async (req, res) => {
  try {
    const visits = await Visit.find({})
      .populate("student", "name email phone")
      .populate("owner", "name email phone")
      .populate("room", "title location rent image")
      .populate("request", "message")
      .sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      count: visits.length,
      visits,
    });
  } catch (error) {
    console.error("Get all visits error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch all visits",
    });
  }
};

// ==========================================
// Get Single Visit
// ==========================================

export const getSingleVisit = async (req, res) => {
  try {
    const visit = await Visit.findById(req.params.id)
      .populate("student", "name email phone")
      .populate("owner", "name email phone")
      .populate("room", "title location rent image")
      .populate("request", "message");

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    return res.status(200).json({
      success: true,
      visit,
    });
  } catch (error) {
    console.error("Get single visit error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch visit",
    });
  }
};

// ==========================================
// Update Visit Status
// ==========================================

export const updateVisitStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "upcoming",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be upcoming, completed or cancelled",
      });
    }

    const visit = await Visit.findById(req.params.id);

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    // Owner can update only own visits
    if (
      req.user.role === "owner" &&
      visit.owner.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this visit",
      });
    }

    visit.status = status;

    await visit.save();

    return res.status(200).json({
      success: true,
      message: "Visit status updated successfully",
      visit,
    });
  } catch (error) {
    console.error("Update visit status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update visit status",
    });
  }
};