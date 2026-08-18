import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import { env } from "./config/env";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import departmentRoutes from "./routes/department.routes";
import doctorRoutes from "./routes/doctor.routes";
import appointmentRoutes from "./routes/appointment.routes";
import uploadRoutes from "./routes/upload.routes";
import {
  blogRouter,
  blogCategoryRouter,
  newsRouter,
  eventRouter,
  galleryRouter,
  testimonialRouter,
  packageRouter,
  insuranceRouter,
  awardRouter,
  accreditationRouter,
  jobRouter,
  enquiryRouter,
  subscriberRouter,
} from "./routes/content.routes";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigins,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan(env.isProd ? "combined" : "dev"));

app.use(
  "/api",
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max: env.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), env.uploadDir)));

app.get("/health", (_req, res) => res.json({ success: true, status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/blogs", blogRouter);
app.use("/api/blog-categories", blogCategoryRouter);
app.use("/api/news", newsRouter);
app.use("/api/events", eventRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/testimonials", testimonialRouter);
app.use("/api/packages", packageRouter);
app.use("/api/insurance-partners", insuranceRouter);
app.use("/api/awards", awardRouter);
app.use("/api/accreditations", accreditationRouter);
app.use("/api/careers", jobRouter);
app.use("/api/enquiries", enquiryRouter);
app.use("/api/subscribers", subscriberRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
