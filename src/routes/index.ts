import { Router } from "express";
import adminRouter from "./admin.routes";
import beneficiaryRouter from "./beneficiary.routes";


const router = Router();

router.use("/admin", adminRouter);
router.use("/beneficiary", beneficiaryRouter);

export default router;