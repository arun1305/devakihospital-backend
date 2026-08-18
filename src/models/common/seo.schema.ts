import { Schema } from "mongoose";

export interface ISeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  /** Optional JSON-LD override, serialized as a string. Named to avoid
   * colliding with Mongoose's internal subdocument `schema` property. */
  structuredData?: string;
  noIndex?: boolean;
}

/**
 * Factory, not a singleton — Mongoose mutates schema internals in place per
 * parent schema it's attached to, so a shared instance corrupts state
 * (e.g. array field `indexedPaths` caching) across unrelated models.
 */
export function createSeoSchema(): Schema<ISeo> {
  return new Schema<ISeo>(
    {
      metaTitle: { type: String, trim: true, maxlength: 70 },
      metaDescription: { type: String, trim: true, maxlength: 160 },
      keywords: { type: [String], default: [] },
      canonical: { type: String, trim: true },
      ogImage: { type: String, trim: true },
      structuredData: { type: String },
      noIndex: { type: Boolean, default: false },
    },
    { _id: false }
  );
}
