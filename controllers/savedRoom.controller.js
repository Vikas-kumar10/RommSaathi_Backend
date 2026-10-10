import SavedRoom from "../models/savedRoom.model.js";
import Room from "../models/room.model.js";

// Save Room
export const saveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const existingSavedRoom = await SavedRoom.findOne({
      student: req.user.userId,
      room: roomId,
    });

    if (existingSavedRoom) {
      return res.status(400).json({
        success: false,
        message: "Room already saved",
      });
    }

    const savedRoom = await SavedRoom.create({
      student: req.user.userId,
      room: roomId,
    });

    res.status(201).json({
      success: true,
      message: "Room saved successfully",
      savedRoom,
    });
  } catch (error) {
    console.error("Save room error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save room",
      error: error.message,
    });
  }
};

// Get logged-in student's saved rooms
export const getSavedRooms = async (req, res) => {
  try {
    const savedRooms = await SavedRoom.find({
      student: req.user.userId,
    })
      .populate({
        path: "room",
        populate: {
          path: "owner",
          select: "name email phone",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: savedRooms.length,
      savedRooms,
    });
  } catch (error) {
    console.error("Get saved rooms error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch saved rooms",
      error: error.message,
    });
  }
};

// Remove saved room
export const removeSavedRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const savedRoom = await SavedRoom.findOneAndDelete({
      student: req.user.userId,
      room: roomId,
    });

    if (!savedRoom) {
      return res.status(404).json({
        success: false,
        message: "Saved room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Room removed from saved rooms",
    });
  } catch (error) {
    console.error("Remove saved room error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove saved room",
      error: error.message,
    });
  }
};

// Check whether room is saved
export const checkSavedRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const savedRoom = await SavedRoom.findOne({
      student: req.user.userId,
      room: roomId,
    });

    res.status(200).json({
      success: true,
      isSaved: !!savedRoom,
    });
  } catch (error) {
    console.error("Check saved room error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to check saved room",
      error: error.message,
    });
  }
};