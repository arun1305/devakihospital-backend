import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { asyncHandler, AppError } from "../utils/AppError";
import { AppointmentStatus } from "../types/enums";
import { AuthenticatedRequest } from "../middleware/auth";

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await Appointment.create(req.body);
  res.status(201).json({ success: true, data: appointment });
});

export const listAppointments = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Number(req.query.limit) || 20);
  const filter: Record<string, unknown> = {};
  if (req.query.status) filter.status = req.query.status;

  const [items, total] = await Promise.all([
    Appointment.find(filter)
      .populate("department", "name slug")
      .populate("doctor assignedDoctor", "name slug photo")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(limit),
    Appointment.countDocuments(filter),
  ]);

  res.json({ success: true, data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});

export const updateAppointmentStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { status, assignedDoctor } = req.body;
  if (status && !Object.values(AppointmentStatus).includes(status)) {
    throw new AppError("Invalid appointment status.", 422);
  }

  const appointment = await Appointment.findByIdAndUpdate(
    req.params.id,
    {
      ...(status ? { status } : {}),
      ...(assignedDoctor ? { assignedDoctor } : {}),
      reviewedBy: req.user?.id,
    },
    { new: true }
  );

  if (!appointment) throw new AppError("Appointment not found.", 404);
  res.json({ success: true, data: appointment });
});
