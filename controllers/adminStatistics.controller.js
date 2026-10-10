import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Request from "../models/request.model.js";
import Visit from "../models/visit.model.js";

export const getPlatformStatistics = async (req, res) => {
  try {
    // =====================================
    // CURRENT DATE RANGE
    // =====================================

    const now = new Date();

    // Current month start
    const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    // Next month start
    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
    );

    // Previous month start
    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    // =====================================
    // MAIN PLATFORM COUNTS
    // =====================================

    const [
      students,
      owners,
      rooms,
      requests,
      visits,
    ] = await Promise.all([
      User.countDocuments({
        role: "student",
      }),

      User.countDocuments({
        role: "owner",
      }),

      Room.countDocuments(),

      Request.countDocuments(),

      Visit.countDocuments(),
    ]);

    // =====================================
    // CURRENT MONTH ACTIVITY
    // =====================================

    const [
      newStudents,
      newRooms,
      visitRequests,
    ] = await Promise.all([
      User.countDocuments({
        role: "student",
        createdAt: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      }),

      Room.countDocuments({
        createdAt: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      }),

      Request.countDocuments({
        createdAt: {
          $gte: startOfCurrentMonth,
          $lt: startOfNextMonth,
        },
      }),
    ]);

    // =====================================
    // PREVIOUS MONTH DATA
    // Used for Monthly Growth
    // =====================================

    const [
      previousStudents,
      previousRooms,
      previousRequests,
    ] = await Promise.all([
      User.countDocuments({
        role: "student",
        createdAt: {
          $gte: startOfPreviousMonth,
          $lt: startOfCurrentMonth,
        },
      }),

      Room.countDocuments({
        createdAt: {
          $gte: startOfPreviousMonth,
          $lt: startOfCurrentMonth,
        },
      }),

      Request.countDocuments({
        createdAt: {
          $gte: startOfPreviousMonth,
          $lt: startOfCurrentMonth,
        },
      }),
    ]);

    // =====================================
    // MONTHLY GROWTH
    // =====================================

    const currentActivity =
      newStudents + newRooms + visitRequests;

    const previousActivity =
      previousStudents +
      previousRooms +
      previousRequests;

    let monthlyGrowth = 0;

    if (previousActivity > 0) {
      monthlyGrowth =
        ((currentActivity - previousActivity) /
          previousActivity) *
        100;
    } else if (currentActivity > 0) {
      monthlyGrowth = 100;
    }

    // =====================================
    // ROOM DISTRIBUTION
    // =====================================

    let approvedRooms = 0;
    let pendingRooms = 0;
    let rejectedRooms = 0;

    /*
      If your Room model has approvalStatus:
        pending
        approved
        rejected
    */

    try {
      [
        approvedRooms,
        pendingRooms,
        rejectedRooms,
      ] = await Promise.all([
        Room.countDocuments({
          approvalStatus: "approved",
        }),

        Room.countDocuments({
          approvalStatus: "pending",
        }),

        Room.countDocuments({
          approvalStatus: "rejected",
        }),
      ]);
    } catch (error) {
      console.log(
        "Room approval statistics unavailable:",
        error.message
      );
    }

    // =====================================
    // ACTIVITY PROGRESS
    // =====================================

    /*
      Progress bars ke liye percentage.

      Current month ke maximum activity ko
      100% maana gaya hai.
    */

    const maxActivity = Math.max(
      newStudents,
      newRooms,
      visitRequests,
      1
    );

    const newStudentsPercentage = Math.round(
      (newStudents / maxActivity) * 100
    );

    const newRoomsPercentage = Math.round(
      (newRooms / maxActivity) * 100
    );

    const visitRequestsPercentage = Math.round(
      (visitRequests / maxActivity) * 100
    );

    // =====================================
    // RESPONSE
    // =====================================

    return res.status(200).json({
      success: true,

      statistics: {
        students,
        owners,
        rooms,
        requests,
        visits,

        monthlyGrowth: Number(
          monthlyGrowth.toFixed(1)
        ),

        monthlyActivity: {
          newStudents,
          newRooms,
          visitRequests,

          newStudentsPercentage,
          newRoomsPercentage,
          visitRequestsPercentage,
        },

        roomDistribution: {
          approved: approvedRooms,
          pending: pendingRooms,
          rejected: rejectedRooms,
        },
      },
    });
  } catch (error) {
    console.error(
      "Get platform statistics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch platform statistics",
    });
  }
};