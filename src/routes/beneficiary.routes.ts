import { Router } from "express";
import { loginBeneficiary, updateLocation } from "../controllers/beneficiary.controller";
import { authenticateToken } from "../middlewares/auth";

const beneficiaryRouter = Router();

beneficiaryRouter.post("/login", loginBeneficiary);
beneficiaryRouter.put("/updateLocation", authenticateToken, updateLocation);

export default beneficiaryRouter;