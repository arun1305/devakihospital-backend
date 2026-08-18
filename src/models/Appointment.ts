import { Schema, model, Document, Types } from "mongoose";
import { AppointmentStatus } from "../types/enums";

export interface IAppointment extends Document {
  _id: Types.ObjectId;
  patientName: string;
  email: string;
  phone: string;
  department: Types.ObjectId;
  doctor?: Types.ObjectId;
  preferredDate: Date;
  preferredTimeSlot: string;
  message?: string;
  status: AppointmentStatus;
  assignedDoctor?: Types.ObjectId;
  reviewedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    patientName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
    preferredDate: { type: Date, required: true },
    preferredTimeSlot: { type: String, required: true },
    message: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: Object.values(AppointmentStatus),
      default: AppointmentStatus.PENDING,
    },
    assignedDoctor: { type: Schema.Types.ObjectId, ref: "Doctor" },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

AppointmentSchema.index({ status: 1, createdAt: -1 });

export const Appointment = model<IAppointment>("Appointment", AppointmentSchema);
