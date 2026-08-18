import { Schema, model, Document, Types } from "mongoose";
import { createSeoSchema, ISeo } from "./common/seo.schema";
import { ContentStatus } from "../types/enums";

export interface IFaqItem {
  question: string;
  answer: string;
}

export interface IDepartment extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  overview: string;
  icon?: string;
  heroImage?: string;
  treatments: string[];
  facilities: string[];
  technology: string[];
  faqs: IFaqItem[];
  doctors: Types.ObjectId[];
  contactPhone?: string;
  contactEmail?: string;
  status: ContentStatus;
  order: number;
  seo: ISeo;
  createdAt: Date;
  updatedAt: Date;
}

const FaqItemSchema = new Schema<IFaqItem>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const DepartmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    shortDescription: { type: String, required: true, trim: true, maxlength: 220 },
    overview: { type: String, required: true },
    icon: { type: String },
    heroImage: { type: String },
    treatments: [{ type: String, trim: true }],
    facilities: [{ type: String, trim: true }],
    technology: [{ type: String, trim: true }],
    faqs: [FaqItemSchema],
    doctors: [{ type: Schema.Types.ObjectId, ref: "Doctor" }],
    contactPhone: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    status: {
      type: String,
      enum: Object.values(ContentStatus),
      default: ContentStatus.PUBLISHED,
    },
    order: { type: Number, default: 0 },
    seo: { type: createSeoSchema(), default: () => ({}) },
  },
  { timestamps: true }
);

DepartmentSchema.index({ status: 1, order: 1 });

export const Department = model<IDepartment>("Department", DepartmentSchema);
