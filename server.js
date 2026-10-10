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

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

// CORS middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB().catch((error) => {
  console.error("Database connection error:", error.message);
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

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RoomSaathi API is runningg",
  });
});

// Local development server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for Vercel
export default app;
