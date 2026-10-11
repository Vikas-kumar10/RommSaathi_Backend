// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";

// import connectDB from "./config/db.js";

// import authRoutes from "./routes/auth.routes.js";
// import roomRoutes from "./routes/room.routes.js";
// import requestRoutes from "./routes/request.routes.js";
// import savedRoomRoutes from "./routes/savedRoom.routes.js";
// import ownerDashboardRoutes from "./routes/ownerDashboard.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import visitRoutes from "./routes/visit.routes.js";
// import reportRoutes from "./routes/report.routes.js";
// import complaintRoutes from "./routes/complaint.routes.js";
// import adminStatisticsRoutes from "./routes/adminStatistics.routes.js"
// import adminRoutes from "./routes/admin.routes.js"

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Database
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/rooms", roomRoutes);
// app.use("/api/requests", requestRoutes);
// app.use("/api/saved-rooms", savedRoomRoutes);
// app.use("/api/owner", ownerDashboardRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/visits", visitRoutes);
// app.use("/api/reports", reportRoutes);
// app.use("/api/complaints", complaintRoutes);
// app.use("/api/admin/statistics", adminStatisticsRoutes);
// app.use("/api/admin", adminRoutes);

// // Health check
// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "RoomSaathi API is running",
//   });
// });

// // Server
// const PORT = process.env.PORT || 8000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";
import requestRoutes from "./routes/request.routes.js";
import savedRoomRoutes from "./routes/savedRoom.routes.js";
import ownerDashboardRoutes from "./routes/ownerDashboard.routes.js";
import userRoutes from "./routes/user.routes.js";
import visitRoutes from "./routes/visit.routes.js";
import reportRoutes from "./routes/report.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import adminStatisticsRoutes from "./routes/adminStatistics.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",").map((url) => url.trim())
      : true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/saved-rooms", savedRoomRoutes);
app.use("/api/owner", ownerDashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin/statistics", adminStatisticsRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RoomSaathi API is running",
  });
});

// Start server after initiating database connection
const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`RoomSaathi server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();