import { Schema, model, Document, Types } from "mongoose";
import { ContentStatus } from "../types/enums";

export interface ITestimonial extends Document {
  _id: Types.ObjectId;
  patientName: string;
  photo?: string;
  rating: number;
  message: string;
  department?: Types.ObjectId;
  status: ContentStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    patientName: { type: String, required: true, trim: true },
    photo: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true, maxlength: 1000 },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    status: {
      type: String,
      enum: Object.values(ContentStatus),
      default: ContentStatus.PUBLISHED,
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Testimonial = model<ITestimonial>("Testimonial", TestimonialSchema);
