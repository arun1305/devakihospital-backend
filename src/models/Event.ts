import { Schema, model, Document, Types } from "mongoose";
import { ContentStatus } from "../types/enums";

export interface IEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  bannerImage?: string;
  gallery: string[];
  registrationEnabled: boolean;
  registrationLimit?: number;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true, trim: true },
    bannerImage: { type: String },
    gallery: [{ type: String }],
    registrationEnabled: { type: Boolean, default: false },
    registrationLimit: { type: Number },
    status: {
      type: String,
      enum: Object.values(ContentStatus),
      default: ContentStatus.DRAFT,
    },
  },
  { timestamps: true }
);

EventSchema.index({ startDate: 1 });

export const Event = model<IEvent>("Event", EventSchema);

export interface IEventRegistration extends Document {
  _id: Types.ObjectId;
  event: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const EventRegistration = model<IEventRegistration>(
  "EventRegistration",
  EventRegistrationSchema
);
