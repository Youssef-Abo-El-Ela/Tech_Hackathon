import { Router } from "express";
import { loginBeneficiary, updateAlertStatus, updateLocation } from "../controllers/beneficiary.controller";
import { authenticateToken } from "../middlewares/auth";

const beneficiaryRouter = Router();

beneficiaryRouter.post("/login", loginBeneficiary);
beneficiaryRouter.put("/updateLocation", authenticateToken, updateLocation);
beneficiaryRouter.put("/updateAlertStatus", authenticateToken, updateAlertStatus);

export default beneficiaryRouter;