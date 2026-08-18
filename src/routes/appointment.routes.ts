import { Router } from "express";
import { body } from "express-validator";
import {
  createAppointment,
  listAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller";
import { validate } from "../middleware/validate";
import { requireAuth, requireRole } from "../middleware/auth";
import { UserRole } from "../types/enums";

const router = Router();

router.post(
  "/",
  [
    body("patientName").trim().notEmpty().withMessage("Patient name is required."),
    body("email").isEmail().withMessage("A valid email is required."),
    body("phone").trim().notEmpty().withMessage("Phone number is required."),
    body("department").isMongoId().withMessage("A valid department is required."),
    body("preferredDate").isISO8601().withMessage("A valid preferred date is required."),
    body("preferredTimeSlot").trim().notEmpty(),
  ],
  validate,
  createAppointment
);

router.get(
  "/",
  requireAuth,
  requireRole(UserRole.ADMIN, UserRole.EDITOR, UserRole.RECEPTIONIST),
  listAppointments
);

router.patch(
  "/:id/status",
  requireAuth,
  requireRole(UserRole.ADMIN, UserRole.RECEPTIONIST),
  updateAppointmentStatus
);

export default router;
