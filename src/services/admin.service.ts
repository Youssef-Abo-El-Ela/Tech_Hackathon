import { prisma } from "../app";
import { comparePassword, hashPassword } from "../utils/hash";
import { ErrorGenerator } from "../utils/errorGenerator";
import { customAlphabet } from "nanoid";

export const loginAdmin = async (email: string, password: string) => {
    const admin = await prisma.admins.findUnique({
        where: { email }
    })

    if (!admin) {
        throw new ErrorGenerator("Admin not found", 404);
    }

    const isPasswordValid = await comparePassword(password, admin.password);

    if (!isPasswordValid) {
        throw new ErrorGenerator("Invalid credentials", 401);
    }

    return admin;
}

export const getUsers = async (limit: number, page: number) => {
    const users = await prisma.beneficiaries.findMany({
        select: {
            name: true,
            phone_number: true,
            longitude: true,
            latitude: true,
            location_updated_at: true,
            alert_status: true,
            alert_time: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
            alert_time: "desc"
        }
    });

    if (!users) {
        throw new ErrorGenerator("No users found", 404);
    }

    const total = await prisma.beneficiaries.count();

    return { users, total };
}

export const createAdmin = async (email: string, password: string, username: string, national_id: string, phone_number: string) => {
    const hashedPassword = await hashPassword(password);
    const admin = await prisma.admins.create({
        data: { email, password: hashedPassword, username, national_id, phone_number }
    });

    return admin;

}

export const createBeneficiary = async (name: string, national_id: string, phone_number: string, email?: string) => {
    let data: any;
    const customAlphabet_ = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const beneficiary_id = customAlphabet(customAlphabet_, 10)();

    if (!email) {
        data = { name, national_id, phone_number, beneficiary_id }
    } else {
        data = { name, email, national_id, phone_number, beneficiary_id }
    }

    const beneficiary = await prisma.beneficiaries.create({
        data
    });
    return beneficiary.beneficiary_id;
}