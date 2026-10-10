import Report from "../models/report.model.js";

// ===============================
// CREATE REPORT
// ===============================
export const createReport = async (req, res) => {
  try {
    const {
      type,
      targetType,
      targetRoom,
      targetUser,
      targetRequest,
      targetVisit,
      description,
    } = req.body;

    // Verify authenticated user
    const reportedBy = req.user?.userId;
    const reporterRole = req.user?.role;

    if (!reportedBy) {
      return res.status(401).json({
        success: false,
        message: "Authenticated user ID not found",
      });
    }

    if (!["student", "owner"].includes(reporterRole)) {
      return res.status(403).json({
        success: false,
        message: "Only students and owners can submit reports",
      });
    }

    if (!type || !targetType || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Type, target type and description are required",
      });
    }

    const validTypes = [
      "fake_room",
      "wrong_information",
      "duplicate_listing",
      "suspicious_user",
      "inappropriate_content",
      "other",
    ];

    const validTargetTypes = ["room", "user", "request", "visit", "other"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report type",
      });
    }

    if (!validTargetTypes.includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target type",
      });
    }

    if (description.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Description cannot exceed 2000 characters",
      });
    }

    // Verify that the selected target exists
    if (targetType === "room" && !targetRoom) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    if (targetType === "user" && !targetUser) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (targetType === "request" && !targetRequest) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    if (targetType === "visit" && !targetVisit) {
      return res.status(400).json({
        success: false,
        message: "Visit ID is required",
      });
    }

    const report = await Report.create({
      reportedBy,
      reporterRole,
      type,
      targetType,
      targetRoom: targetType === "room" ? targetRoom : null,
      targetUser: targetType === "user" ? targetUser : null,
      targetRequest: targetType === "request" ? targetRequest : null,
      targetVisit: targetType === "visit" ? targetVisit : null,
      description: description.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Create report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit report",
    });
  }
};

// ===============================
// GET MY REPORTS
// Student / Owner
// ===============================
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({
      reportedBy: req.user.id,
    })
      .populate("targetRoom", "title location rent")
      .populate("targetUser", "name email phone role")
      .populate("targetRequest")
      .populate("targetVisit")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get my reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};

// ===============================
// GET ALL REPORTS
// Admin
// ===============================
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate("reportedBy", "name email phone role")
      .populate("targetRoom", "title location rent")
      .populate("targetUser", "name email phone role")
      .populate("targetRequest")
      .populate("targetVisit")
      .populate("resolvedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    console.error("Get all reports error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
};

// ===============================
// GET SINGLE REPORT
// ===============================
export const getSingleReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("reportedBy", "name email phone role")
      .populate("targetRoom", "title location rent")
      .populate("targetUser", "name email phone role")
      .populate("targetRequest")
      .populate("targetVisit")
      .populate("resolvedBy", "name email");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Get single report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report",
    });
  }
};

// ===============================
// UPDATE REPORT STATUS
// Admin
// ===============================
export const updateReportStatus = async (req, res) => {
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
        message: "Invalid report status",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = status;

    if (adminNote !== undefined) {
      report.adminNote = adminNote;
    }

    if (status === "resolved") {
      report.resolvedBy = req.user.id;
      report.resolvedAt = new Date();
    } else {
      report.resolvedBy = null;
      report.resolvedAt = null;
    }

    await report.save();

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      report,
    });
  } catch (error) {
    console.error("Update report status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report status",
    });
  }
};

// ===============================
// DELETE REPORT
// ===============================
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    await Report.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete report error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete report",
    });
  }
};
