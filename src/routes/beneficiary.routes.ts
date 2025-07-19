import { Router } from "express";
import { loginBeneficiary } from "../controllers/beneficiary.controller";

const beneficiaryRouter = Router();

beneficiaryRouter.post("/login", loginBeneficiary);

export default beneficiaryRouter;