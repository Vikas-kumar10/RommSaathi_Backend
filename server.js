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
import adminAuthRoutes from "./routes/adminAuth.routes.js";

// Load environment variables
dotenv.config();

const app = express();

// Trust the hosting platform's proxy when needed
app.set("trust proxy", 1);

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  ...(process.env.CLIENT_URL || "")
    .split(",")
    .map((url) => url.trim().replace(/\/+$/, ""))
    .filter(Boolean),
];

// CORS configuration — register only once
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.error("CORS blocked origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Request body middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RoomSaathi API is running",
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RoomSaathi API is running",
  });
});

// API routes
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
app.use("/api/admin/auth", adminAuthRoutes);

// Not found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Backend error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  const isCorsError = err.message === "Not allowed by CORS";

  res.status(isCorsError ? 403 : 500).json({
    success: false,
    message: isCorsError
      ? "Origin is not allowed"
      : "Internal server error",
  });
});

// Start server after successful database connection
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
