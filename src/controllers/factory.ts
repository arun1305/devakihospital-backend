import { Request, Response } from "express";
import { Model } from "mongoose";
import { asyncHandler, AppError } from "../utils/AppError";

interface FactoryOptions {
  searchFields?: string[];
  defaultSort?: string;
  populate?: string | string[];
}

export function createCrudController<T>(model: Model<T>, options: FactoryOptions = {}) {
  const { searchFields = [], defaultSort = "-createdAt", populate } = options;

  const list = asyncHandler(async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;

    if (req.query.q && searchFields.length) {
      filter.$or = searchFields.map((field) => ({
        [field]: { $regex: String(req.query.q), $options: "i" },
      }));
    }

    const rangeOperators: Record<string, string> = {
      _gte: "$gte",
      _lte: "$lte",
      _gt: "$gt",
      _lt: "$lt",
    };

    Object.entries(req.query).forEach(([key, value]) => {
      if (["page", "limit", "q", "status", "sort"].includes(key)) return;

      const rangeSuffix = Object.keys(rangeOperators).find((suffix) => key.endsWith(suffix));
      if (rangeSuffix) {
        const field = key.slice(0, -rangeSuffix.length);
        const operator = rangeOperators[rangeSuffix];
        const numericValue = Number(value);
        filter[field] = {
          ...(typeof filter[field] === "object" && filter[field] !== null ? filter[field] : {}),
          [operator]: Number.isNaN(numericValue) ? value : numericValue,
        };
        return;
      }

      if (key.endsWith("_in")) {
        const field = key.slice(0, -3);
        filter[field] = { $in: String(value).split(",").map((v) => v.trim()) };
        return;
      }

      filter[key] = value;
    });

    let query = model.find(filter).sort(String(req.query.sort ?? defaultSort)).skip(skip).limit(limit);
    if (populate) query = query.populate(populate as any);

    const [items, total] = await Promise.all([query.exec(), model.countDocuments(filter)]);

    res.json({
      success: true,
      data: items,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  });

  const getOne = asyncHandler(async (req: Request, res: Response) => {
    const idOrSlug = String(req.params.idOrSlug);
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    let query = isObjectId ? model.findById(idOrSlug) : model.findOne({ slug: idOrSlug } as any);
    if (populate) query = query.populate(populate as any);
    const item = await query.exec();
    if (!item) throw new AppError("Resource not found.", 404);
    res.json({ success: true, data: item });
  });

  const create = asyncHandler(async (req: Request, res: Response) => {
    const item = await model.create(req.body);
    res.status(201).json({ success: true, data: item });
  });

  const update = asyncHandler(async (req: Request, res: Response) => {
    const item = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new AppError("Resource not found.", 404);
    res.json({ success: true, data: item });
  });

  const remove = asyncHandler(async (req: Request, res: Response) => {
    const item = await model.findByIdAndDelete(req.params.id);
    if (!item) throw new AppError("Resource not found.", 404);
    res.json({ success: true, data: null });
  });

  return { list, getOne, create, update, remove };
}
