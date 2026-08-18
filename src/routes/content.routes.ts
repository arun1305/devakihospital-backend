import { Router } from "express";
import { Blog, BlogCategory } from "../models/Blog";
import { News } from "../models/News";
import { Event, EventRegistration } from "../models/Event";
import { GalleryAlbum } from "../models/Gallery";
import { Testimonial } from "../models/Testimonial";
import { HealthPackage, PackageBooking } from "../models/Package";
import {
  InsurancePartner,
  Award,
  Accreditation,
  Enquiry,
  Subscriber,
  JobListing,
  JobApplication,
} from "../models/Misc";
import { createCrudController } from "../controllers/factory";
import { requireAuth, requireRole } from "../middleware/auth";
import { upload } from "../middleware/upload";
import { UserRole } from "../types/enums";
import { asyncHandler, AppError } from "../utils/AppError";

const editorial = [UserRole.ADMIN, UserRole.EDITOR];

function registerCrudRoutes(
  router: Router,
  controller: ReturnType<typeof createCrudController>,
  roles: UserRole[] = editorial
) {
  router.get("/", controller.list);
  router.get("/:idOrSlug", controller.getOne);
  router.post("/", requireAuth, requireRole(...roles), controller.create);
  router.patch("/:id", requireAuth, requireRole(...roles), controller.update);
  router.delete("/:id", requireAuth, requireRole(UserRole.ADMIN), controller.remove);
}

// Blogs
export const blogRouter = Router();
registerCrudRoutes(
  blogRouter,
  createCrudController(Blog, {
    searchFields: ["title", "excerpt", "tags"],
    populate: "category author relatedPosts",
  })
);

export const blogCategoryRouter = Router();
registerCrudRoutes(blogCategoryRouter, createCrudController(BlogCategory, { defaultSort: "name" }));

// News
export const newsRouter = Router();
registerCrudRoutes(
  newsRouter,
  createCrudController(News, { searchFields: ["title", "summary", "tags"] })
);

// Events
export const eventRouter = Router();
registerCrudRoutes(eventRouter, createCrudController(Event, { defaultSort: "startDate" }));
eventRouter.post(
  "/:id/register",
  asyncHandler(async (req, res) => {
    const registration = await EventRegistration.create({ event: req.params.id, ...req.body });
    res.status(201).json({ success: true, data: registration });
  })
);

// Gallery
export const galleryRouter = Router();
registerCrudRoutes(galleryRouter, createCrudController(GalleryAlbum, { searchFields: ["title"] }));

// Testimonials
export const testimonialRouter = Router();
registerCrudRoutes(testimonialRouter, createCrudController(Testimonial, { populate: "department" }));

// Health Packages
export const packageRouter = Router();
registerCrudRoutes(
  packageRouter,
  createCrudController(HealthPackage, { searchFields: ["name", "description"] })
);
packageRouter.post(
  "/:id/book",
  asyncHandler(async (req, res) => {
    const booking = await PackageBooking.create({ package: req.params.id, ...req.body });
    res.status(201).json({ success: true, data: booking });
  })
);

// Insurance / Awards / Accreditations
export const insuranceRouter = Router();
registerCrudRoutes(insuranceRouter, createCrudController(InsurancePartner, { defaultSort: "order" }));

export const awardRouter = Router();
registerCrudRoutes(awardRouter, createCrudController(Award, { defaultSort: "-year" }));

export const accreditationRouter = Router();
registerCrudRoutes(accreditationRouter, createCrudController(Accreditation, { defaultSort: "order" }));

// Careers
export const jobRouter = Router();
registerCrudRoutes(jobRouter, createCrudController(JobListing, { searchFields: ["title", "department"] }));
jobRouter.post(
  "/:id/apply",
  upload.single("resume"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError("A resume file is required.", 400);
    const application = await JobApplication.create({
      job: req.params.id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      coverLetter: req.body.coverLetter,
      resumeUrl: `/uploads/${req.file.filename}`,
    });
    res.status(201).json({ success: true, data: application });
  })
);

// Enquiries & Newsletter (write endpoints public, read/manage restricted)
export const enquiryRouter = Router();
enquiryRouter.post("/", createCrudController(Enquiry, {}).create);
enquiryRouter.get("/", requireAuth, requireRole(...editorial), createCrudController(Enquiry, {}).list);
enquiryRouter.patch(
  "/:id",
  requireAuth,
  requireRole(...editorial),
  createCrudController(Enquiry, {}).update
);

export const subscriberRouter = Router();
subscriberRouter.post("/", createCrudController(Subscriber, {}).create);
subscriberRouter.get(
  "/",
  requireAuth,
  requireRole(UserRole.ADMIN),
  createCrudController(Subscriber, {}).list
);
