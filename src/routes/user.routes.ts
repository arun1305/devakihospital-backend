import { Router } from "express";
import { createCrudController } from "../controllers/factory";
import { User } from "../models/User";
import { requireAuth, requireRole } from "../middleware/auth";
import { UserRole } from "../types/enums";

const router = Router();
const controller = createCrudController(User, { searchFields: ["name", "email"] });

router.use(requireAuth, requireRole(UserRole.ADMIN));
router.get("/", controller.list);
router.get("/:idOrSlug", controller.getOne);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
