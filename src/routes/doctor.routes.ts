import { Router } from "express";
import { Doctor } from "../models/Doctor";
import { createCrudController } from "../controllers/factory";
import { requireAuth, requireRole } from "../middleware/auth";
import { UserRole } from "../types/enums";

const router = Router();
const controller = createCrudController(Doctor, {
  searchFields: ["name", "specializations", "designation"],
  defaultSort: "name",
  populate: "departments",
});

router.get("/", controller.list);
router.get("/:idOrSlug", controller.getOne);
router.post("/", requireAuth, requireRole(UserRole.ADMIN, UserRole.EDITOR), controller.create);
router.patch("/:id", requireAuth, requireRole(UserRole.ADMIN, UserRole.EDITOR), controller.update);
router.delete("/:id", requireAuth, requireRole(UserRole.ADMIN), controller.remove);

export default router;
