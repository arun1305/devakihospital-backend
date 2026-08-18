import { Schema, model, Document, Types } from "mongoose";

export interface IGalleryAlbum extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  category: string;
  coverImage?: string;
  images: string[];
  videos: string[];
  createdAt: Date;
  updatedAt: Date;
}

const GalleryAlbumSchema = new Schema<IGalleryAlbum>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: String, trim: true, default: "General" },
    coverImage: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
  },
  { timestamps: true }
);

export const GalleryAlbum = model<IGalleryAlbum>("GalleryAlbum", GalleryAlbumSchema);
