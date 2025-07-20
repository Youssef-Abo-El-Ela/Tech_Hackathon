import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticateToken } from "../middlewares/auth";

const router = Router();

router.post("/login", adminController.loginAdmin);
router.post("/create", adminController.createAdmin);
router.post("/create-beneficiary", authenticateToken, adminController.createBeneficiary);
router.get("/users", authenticateToken, adminController.getUsers);
router.get("/socket-status", authenticateToken, adminController.getSocketStatus);

export default router;