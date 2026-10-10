import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;

    if (!conversationId || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Conversation ID and message are required",
      });
    }

    const conversation =
      await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const userId = req.user.id;

    const isStudent =
      conversation.student.toString() ===
      userId.toString();

    const isOwner =
      conversation.owner.toString() ===
      userId.toString();

    if (!isStudent && !isOwner) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to send messages in this conversation",
      });
    }

    const receiver = isStudent
      ? conversation.owner
      : conversation.student;

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      receiver,
      text: text.trim(),
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();

    if (isStudent) {
      conversation.ownerUnread += 1;
    } else {
      conversation.studentUnread += 1;
    }

    await conversation.save();

    const populatedMessage =
      await Message.findById(message._id)
        .populate("sender", "name")
        .populate("receiver", "name");

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error(
      "Send message error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

export const getConversationMessages = async (
  req,
  res
) => {
  try {
    const { conversationId } = req.params;

    const conversation =
      await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const userId = req.user.id;

    const isStudent =
      conversation.student.toString() ===
      userId.toString();

    const isOwner =
      conversation.owner.toString() ===
      userId.toString();

    if (!isStudent && !isOwner) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to view these messages",
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    // Messages read kar do
    await Message.updateMany(
      {
        conversation: conversationId,
        receiver: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    if (isStudent) {
      conversation.studentUnread = 0;
    } else {
      conversation.ownerUnread = 0;
    }

    await conversation.save();

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(
      "Get messages error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};