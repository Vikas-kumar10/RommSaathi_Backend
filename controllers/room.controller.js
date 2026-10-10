import Room from "../models/room.model.js";
import cloudinary from "../config/cloudinary.js";


// Upload Image to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "roomsaathi/rooms",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};


// Add Room
// Add Room
export const addRoom = async (req, res) => {
  try {
    console.log("\n========== ADD ROOM ==========");
    console.log("USER:", req.user);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files?.length || 0);

    const {
      title,
      description,
      rent,
      location,
      roomType,
      facilities,
    } = req.body;

    // Required fields
    if (
      !title ||
      !description ||
      !rent ||
      !location ||
      !roomType
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    // Check logged-in user
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "User authentication information is missing",
      });
    }

    // Check images
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one room image",
      });
    }

    // Parse facilities
    let parsedFacilities = [];

    if (facilities) {
      try {
        parsedFacilities = JSON.parse(facilities);

        if (!Array.isArray(parsedFacilities)) {
          return res.status(400).json({
            success: false,
            message: "Facilities must be an array",
          });
        }
      } catch (error) {
        console.error(
          "Facilities JSON error:",
          error.message
        );

        return res.status(400).json({
          success: false,
          message: "Invalid facilities format",
        });
      }
    }

    // Upload images
    const uploadedImages = [];

    for (const file of req.files) {
      console.log(
        "Uploading:",
        file.originalname
      );

      const result = await uploadToCloudinary(
        file.buffer
      );

      console.log(
        "Cloudinary URL:",
        result.secure_url
      );

      uploadedImages.push(result.secure_url);
    }

    // Create room
    const room = await Room.create({
      owner: req.user.userId,
      title: title.trim(),
      description: description.trim(),
      rent: Number(rent),
      location: location.trim(),
      roomType,
      facilities: parsedFacilities,
      images: uploadedImages,
    });

    console.log(
      "Room created successfully:",
      room._id
    );

    return res.status(201).json({
      success: true,
      message: "Room added successfully",
      room,
    });

  } catch (error) {
    console.error("\n========== ADD ROOM ERROR ==========");
    console.error("Message:", error.message);
    console.error("Full Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add room",
      error: error.message,
    });
  }
};


// Get All Rooms
// Get All Approved and Available Rooms (Public)
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      approvalStatus: "approved",
      status: "available",
    })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get all rooms error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
      error: error.message,
    });
  }
};;


// Get Single Room
// Get Single Approved and Available Room (Public)
export const getSingleRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findOne({
      _id: id,
      approvalStatus: "approved",
      status: "available",
    }).populate("owner", "name email phone");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found or not available",
      });
    }

    return res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get single room error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch room",
      error: error.message,
    });
  }
};


// Update Room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check owner
    if (room.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this room",
      });
    }

    const updateData = {
      title: req.body.title,
      description: req.body.description,
      rent: req.body.rent,
      location: req.body.location,
      roomType: req.body.roomType,
      status: req.body.status,
    };

    if (req.body.facilities) {
      updateData.facilities = JSON.parse(
        req.body.facilities
      );
    }

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];

      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer
        );

        uploadedImages.push(result.secure_url);
      }

      updateData.images = uploadedImages;
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Update room error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update room",
      error: error.message,
    });
  }
};


// Delete Room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Check owner
    if (room.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this room",
      });
    }

    await Room.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete room",
      error: error.message,
    });
  }
};


/**----------------------- */
// Get logged-in owner's rooms
export const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      owner: req.user.userId,
    })
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get my rooms error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch yours rooms",
      error: error.message,
    });
  }
};

/*-------for admin page------ */


// Get all rooms for admin
export const getAdminRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Get admin rooms error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
    });
  }
};

// Update room approval status
export const updateRoomApprovalStatus = async (req, res) => {
  try {
    const { approvalStatus } = req.body;

    if (
      !["pending", "approved", "rejected"].includes(
        approvalStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid approval status",
      });
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      {
        approvalStatus,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email phone");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Room ${
        approvalStatus === "approved"
          ? "approved"
          : approvalStatus === "rejected"
          ? "rejected"
          : "set to pending"
      } successfully`,
      room,
    });
  } catch (error) {
    console.error(
      "Update room approval status error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update room status",
    });
  }
};

// Delete room
export const deleteAdminRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Room removed successfully",
    });
  } catch (error) {
    console.error("Delete admin room error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove room",
    });
  }
};