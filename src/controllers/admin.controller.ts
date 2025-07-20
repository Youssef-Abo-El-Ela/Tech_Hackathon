import { Request, Response } from "express";
import * as adminService from "../services/admin.service";
import { ErrorGenerator } from "../utils/errorGenerator";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const admin = await adminService.loginAdmin(email, password);

        const payload = {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            national_id: admin.national_id,
            phone_number: admin.phone_number,
            username: admin.username,
        }

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({ message: "Admin logged in successfully", token });

    } catch (error) {
        if (error instanceof ErrorGenerator) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const users = await adminService.getUsers(Number(limit), Number(page));
        res.status(200).json({ users: users.users, total: users.total });
    } catch (error) {
        if (error instanceof ErrorGenerator) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export const createAdmin = async (req: Request, res: Response) => {
    const { email, password, username, national_id, phone_number } = req.body;
    try {
        const admin = await adminService.createAdmin(email, password, username, national_id, phone_number);
        res.status(200).json({ message: "Admin created successfully", admin });
    }
    catch (error) {
        if (error instanceof ErrorGenerator) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export const createBeneficiary = async (req: Request, res: Response) => {
    const { name, email, national_id, phone_number } = req.body;
    try {
        const beneficiary_id = await adminService.createBeneficiary(name, national_id, phone_number, email);
        res.status(200).json({ message: "Beneficiary created successfully", beneficiary_id });
    } catch (error) {
        if (error instanceof ErrorGenerator) {
            res.status(error.statusCode).json({ message: error.message });
        } else {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

