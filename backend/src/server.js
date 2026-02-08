import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/auth.routes.js";
import itemRoutes from "./routes/item.routes.js";
import borrowRoutes from "./routes/borrow.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import collegeRoutes from "./routes/college.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import testRoutes from "./routes/test.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import unifiedBookingRoutes from "./routes/unified-booking.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  if (Object.keys(req.body).length > 0) {
    console.log('📦 Body:', JSON.stringify(req.body, null, 2));
  }
  if (Object.keys(req.query).length > 0) {
    console.log('🔍 Query:', req.query);
  }
  if (req.files && req.files.length > 0) {
    console.log('🖼️ Files:', req.files.map(f => ({ name: f.originalname, size: f.size })));
  }
  if (req.headers.authorization) {
    console.log('🔑 Auth header present');
  }
  next();
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 PassItOn Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      items: "/api/items",
      borrowRequests: "/api/borrow-requests",
      transactions: "/api/transactions",
      profiles: "/api/profiles",
      colleges: "/api/colleges",
      notifications: "/api/notifications",
      services: "/api/services",
      bookings: "/api/bookings",
      unifiedBookings: "/api/unified-bookings",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/borrow-requests", borrowRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/colleges", collegeRoutes);


app.use("/api/notifications", notificationRoutes);
app.use("/api/test", testRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/unified-bookings", unifiedBookingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`🦇 PassItOn Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  Received SIGINT. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Received SIGTERM. Terminating...');
  server.close(() => {
    console.log('✅ Server terminated');
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  console.error('Stack:', error.stack);
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit on unhandled rejection, just log it
});
