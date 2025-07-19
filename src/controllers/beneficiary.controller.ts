import { Request, Response } from "express";
import { ErrorGenerator } from "../utils/errorGenerator";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";
import * as beneficiaryService from "../services/beneficiary.service";

export const loginBeneficiary = async (req: Request, res: Response) => {
    const { beneficiary_id } = req.body;
    try {
        const beneficiary = await beneficiaryService.loginBeneficiary(beneficiary_id);

        const payload = {
            id: beneficiary.id,
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Beneficiary logged in successfully", token });

    } catch (error) {
        if (error instanceof ErrorGenerator) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}   

export const updateLocation = async (req: Request, res: Response) => {
    const beneficiary_id = req.user.id;
    const { latitude, longitude, location_updated_at } = req.body;
    try {
        await beneficiaryService.updateLocation(latitude, longitude, location_updated_at , beneficiary_id);
        res.status(200).json({ message: "Location updated successfully"});
    } 
    catch (error) {
        if (error instanceof ErrorGenerator) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}