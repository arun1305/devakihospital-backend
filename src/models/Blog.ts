import { Schema, model, Document, Types } from "mongoose";
import { createSeoSchema, ISeo } from "./common/seo.schema";
import { ContentStatus } from "../types/enums";

export interface IBlogCategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
}

const BlogCategorySchema = new Schema<IBlogCategory>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

export const BlogCategory = model<IBlogCategory>("BlogCategory", BlogCategorySchema);

export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: Types.ObjectId;
  tags: string[];
  author: Types.ObjectId;
  readingTimeMinutes: number;
  relatedPosts: Types.ObjectId[];
  status: ContentStatus;
  publishedAt?: Date;
  seo: ISeo;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    featuredImage: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "BlogCategory", required: true },
    tags: [{ type: String, trim: true }],
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    readingTimeMinutes: { type: Number, default: 3 },
    relatedPosts: [{ type: Schema.Types.ObjectId, ref: "Blog" }],
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

BlogSchema.index({ title: "text", excerpt: "text", tags: "text" });

export const Blog = model<IBlog>("Blog", BlogSchema);
