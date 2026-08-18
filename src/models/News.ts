import { Schema, model, Document, Types } from "mongoose";
import { createSeoSchema, ISeo } from "./common/seo.schema";
import { ContentStatus } from "../types/enums";

export interface INews extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: ContentStatus;
  publishedAt?: Date;
  seo: ISeo;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    summary: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    featuredImage: { type: String },
    category: { type: String, trim: true, default: "General" },
    tags: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: Object.values(ContentStatus),
      default: ContentStatus.DRAFT,
    },
    publishedAt: { type: Date },
    seo: { type: createSeoSchema(), default: () => ({}) },
  },
  { timestamps: true }
);

NewsSchema.index({ title: "text", summary: "text", tags: "text" });

export const News = model<INews>("News", NewsSchema);
