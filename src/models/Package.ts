import { Schema, model, Document, Types } from "mongoose";
import { createSeoSchema, ISeo } from "./common/seo.schema";
import { ContentStatus } from "../types/enums";

export interface IHealthPackage extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  category: string;
  categoryOrder: number;
  /** Local-language name shown as a subtitle, e.g. Tamil for a Madurai-based hospital. */
  localName?: string;
  /** Tier label distinguishing packages within the same category (Bronze/Silver/Gold, Male/Female, etc). Omit for single-tier categories. */
  tier?: string;
  tierOrder: number;
  popular: boolean;
  price: number;
  discountedPrice?: number;
  description: string;
  inclusions: string[];
  idealFor: string[];
  image?: string;
  status: ContentStatus;
  seo: ISeo;
  createdAt: Date;
  updatedAt: Date;
}

const HealthPackageSchema = new Schema<IHealthPackage>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    category: { type: String, required: true, trim: true },
    categoryOrder: { type: Number, default: 0 },
    localName: { type: String, trim: true },
    tier: { type: String, trim: true },
    tierOrder: { type: Number, default: 0 },
    popular: { type: Boolean, default: false },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    description: { type: String, required: true },
    inclusions: [{ type: String, trim: true }],
    idealFor: [{ type: String, trim: true }],
    image: { type: String },
    status: {
      type: String,
      enum: Object.values(ContentStatus),
      default: ContentStatus.PUBLISHED,
    },
    seo: { type: createSeoSchema(), default: () => ({}) },
  },
  { timestamps: true }
);

HealthPackageSchema.index({ category: 1, categoryOrder: 1, tierOrder: 1 });

export const HealthPackage = model<IHealthPackage>("HealthPackage", HealthPackageSchema);

export interface IPackageBooking extends Document {
  _id: Types.ObjectId;
  package: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  preferredDate: Date;
  status: string;
  createdAt: Date;
}

const PackageBookingSchema = new Schema<IPackageBooking>(
  {
    package: { type: Schema.Types.ObjectId, ref: "HealthPackage", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    preferredDate: { type: Date, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const PackageBooking = model<IPackageBooking>("PackageBooking", PackageBookingSchema);
