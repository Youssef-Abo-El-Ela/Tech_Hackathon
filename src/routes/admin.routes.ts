import { Router } from "express";
import { createAdmin, getUsers, loginAdmin } from "../controllers/admin.controller";
import { authenticateToken } from "../middlewares/auth";

const adminRouter = Router();

adminRouter.post("/login", loginAdmin);
adminRouter.get("/getUsers", authenticateToken, getUsers);
adminRouter.post("/createAdmin", createAdmin);

export default adminRouter;