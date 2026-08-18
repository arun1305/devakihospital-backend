import { Schema, model, Document, Types } from "mongoose";

export interface IInsurancePartner extends Document {
  _id: Types.ObjectId;
  name: string;
  logo: string;
  website?: string;
  order: number;
}

const InsurancePartnerSchema = new Schema<IInsurancePartner>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    website: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const InsurancePartner = model<IInsurancePartner>(
  "InsurancePartner",
  InsurancePartnerSchema
);

export interface IAward extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  year: number;
  image?: string;
  order: number;
}

const AwardSchema = new Schema<IAward>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    year: { type: Number, required: true },
    image: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Award = model<IAward>("Award", AwardSchema);

export interface IAccreditation extends Document {
  _id: Types.ObjectId;
  name: string;
  logo: string;
  description?: string;
  order: number;
}

const AccreditationSchema = new Schema<IAccreditation>(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: String, required: true },
    description: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Accreditation = model<IAccreditation>("Accreditation", AccreditationSchema);

export interface IEnquiry extends Document {
  _id: Types.ObjectId;
  type: "contact" | "doctor" | "international" | "second-opinion" | "career";
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  handled: boolean;
  createdAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    type: {
      type: String,
      enum: ["contact", "doctor", "international", "second-opinion", "career"],
      default: "contact",
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true, maxlength: 2000 },
    handled: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Enquiry = model<IEnquiry>("Enquiry", EnquirySchema);

export interface ISubscriber extends Document {
  _id: Types.ObjectId;
  email: string;
  subscribedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now },
});

export const Subscriber = model<ISubscriber>("Subscriber", SubscriberSchema);

export interface IMediaAsset extends Document {
  _id: Types.ObjectId;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string;
  uploadedBy?: Types.ObjectId;
  createdAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    fileName: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    altText: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const MediaAsset = model<IMediaAsset>("MediaAsset", MediaAssetSchema);

export interface IJobListing extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const JobListingSchema = new Schema<IJobListing>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    employmentType: { type: String, default: "Full-time" },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const JobListing = model<IJobListing>("JobListing", JobListingSchema);

export interface IJobApplication extends Document {
  _id: Types.ObjectId;
  job: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  createdAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    job: { type: Schema.Types.ObjectId, ref: "JobListing", required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const JobApplication = model<IJobApplication>("JobApplication", JobApplicationSchema);
