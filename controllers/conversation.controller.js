import Conversation from "../models/conversation.model.js";

export const createOrGetConversation = async (req, res) => {
  try {
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: "Room ID is required",
      });
    }

    const studentId = req.user.id;

    // Room fetch karo
    const Room = (await import("../models/room.model.js")).default;

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const ownerId = room.owner;

    // Student apne hi room ko message na kare
    if (studentId.toString() === ownerId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot message yourself",
      });
    }

    let conversation = await Conversation.findOne({
      student: studentId,
      owner: ownerId,
      room: roomId,
    })
      .populate("student", "name email phone")
      .populate("owner", "name email phone")
      .populate("room", "title location rent image");

    if (!conversation) {
      conversation = await Conversation.create({
        student: studentId,
        owner: ownerId,
        room: roomId,
      });

      conversation = await Conversation.findById(
        conversation._id
      )
        .populate("student", "name email phone")
        .populate("owner", "name email phone")
        .populate("room", "title location rent image");
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(
      "Create/Get conversation error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};

export const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      $or: [
        { student: userId },
        { owner: userId },
      ],
    })
      .populate("student", "name email phone")
      .populate("owner", "name email phone")
      .populate("room", "title location rent image")
      .sort({ lastMessageAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error(
      "Get conversations error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
};