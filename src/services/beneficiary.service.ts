import { prisma } from "../app";
import { ErrorGenerator } from "../utils/errorGenerator";

export const loginBeneficiary = async (beneficiary_id: string) => {
    const beneficiary = await prisma.beneficiaries.findUnique({
        where: {
            beneficiary_id: beneficiary_id,
        },
    });

    if (!beneficiary) {
        throw new ErrorGenerator("Beneficiary not found", 404);
    }

    return beneficiary;
}

export const updateLocation = async (latitude: number, longitude: number, location_updated_at: string , beneficiary_id: string) => {

    const beneficiary = await prisma.beneficiaries.update({
        where: {
            id: beneficiary_id,
        },
        data: { latitude, longitude, location_updated_at }
    });

    if (!beneficiary) {
        throw new ErrorGenerator("Beneficiary not found", 404);
    }
}

export const updateAlertStatus = async (latitude: number, longitude: number, location_updated_at: Date, alert_status: boolean, alert_time: Date, beneficiary_id: string) => {
    const beneficiary = await prisma.beneficiaries.update({
        where: {
            id: beneficiary_id,
        },
        data: { latitude, longitude, location_updated_at, alert_status, alert_time }
    });

    if (!beneficiary) {
        throw new ErrorGenerator("Beneficiary not found", 404);
    }
}