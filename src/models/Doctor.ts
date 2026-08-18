import { Schema, model, Document, Types } from "mongoose";
import { createSeoSchema, ISeo } from "./common/seo.schema";
import { Gender, ContentStatus } from "../types/enums";

export interface IDaySchedule {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface IDoctor extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  photo?: string;
  gender: Gender;
  departments: Types.ObjectId[];
  designation: string;
  qualifications: string[];
  experienceYears: number;
  languages: string[];
  specializations: string[];
  biography: string;
  publications: string[];
  research: string[];
  awards: string[];
  schedule: IDaySchedule[];
  status: ContentStatus;
  featured: boolean;
  seo: ISeo;
  createdAt: Date;
  updatedAt: Date;
}

const DayScheduleSchema = new Schema<IDaySchedule>(
  {
    day: { type: String, enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false }
);

const DoctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    photo: { type: String },
    gender: { type: String, enum: Object.values(Gender), required: true },
    departments: [{ type: Schema.Types.ObjectId, ref: "Department", required: true }],
    designation: { type: String, required: true, trim: true },
    qualifications: [{ type: String, trim: true }],
    experienceYears: { type: Number, required: true, min: 0 },
    languages: [{ type: String, trim: true }],
    specializations: [{ type: String, trim: true }],
    biography: { type: String, default: "" },
    publications: [{ type: String }],
    research: [{ type: String }],
    awards: [{ type: String }],
    schedule: [DayScheduleSchema],
    status: {
      type: String,
      enum: Object.values(ContentStatus),
      default: ContentStatus.PUBLISHED,
    },
    featured: { type: Boolean, default: false },
    seo: { type: createSeoSchema(), default: () => ({}) },
  },
  { timestamps: true }
);

DoctorSchema.index({ departments: 1, status: 1 });
DoctorSchema.index({ name: "text", specializations: "text" });

export const Doctor = model<IDoctor>("Doctor", DoctorSchema);
