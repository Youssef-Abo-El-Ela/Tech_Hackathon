import { Router } from "express";
import { getUsers, loginAdmin } from "../controllers/admin.controller";
import { authenticateToken } from "../middlewares/auth";

const adminRouter = Router();

adminRouter.post("/login", loginAdmin);
adminRouter.get("/getUsers", authenticateToken, getUsers);

export default adminRouter;