import { Router } from "express";
import { upload } from "../middleware/upload";
import { requireAuth, requireRole } from "../middleware/auth";
import { UserRole } from "../types/enums";
import { asyncHandler, AppError } from "../utils/AppError";
import { MediaAsset } from "../models/Misc";

const router = Router();

router.post(
  "/",
  requireAuth,
  requireRole(UserRole.ADMIN, UserRole.EDITOR),
  upload.single("file"),
  asyncHandler(async (req: any, res) => {
    if (!req.file) throw new AppError("No file uploaded.", 400);

    const asset = await MediaAsset.create({
      fileName: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      uploadedBy: req.user?.id,
    });

    res.status(201).json({ success: true, data: asset });
  })
);

export default router;
