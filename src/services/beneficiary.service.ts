import { prisma } from "../app";
import { ErrorGenerator } from "../utils/errorGenerator";
import { decode as atob } from "base-64";

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

export const updateLocation = async (latitude: number, longitude: number, location_updated_at: string, beneficiary_id: string) => {
    
    const locationDate = new Date(location_updated_at);
    const beneficiary = await prisma.beneficiaries.update({
        where: {
            id: beneficiary_id,
        },
        data: { latitude, longitude, location_updated_at: locationDate }
    });

    if (!beneficiary) {
        throw new ErrorGenerator("Beneficiary not found", 404);
    }
}

export const updateAlertStatus = async (latitude: number, longitude: number, location_updated_at: Date, alert_status: boolean, alert_time: Date, beneficiary_id: string) => {
    const locationDate = new Date(location_updated_at);
    const alertTime = new Date(alert_time);
    const beneficiary = await prisma.beneficiaries.update({
        where: {
            id: beneficiary_id,
        },
        data: { latitude, longitude, location_updated_at: locationDate, alert_status, alert_time: alertTime }
    });

    if (!beneficiary) {
        throw new ErrorGenerator("Beneficiary not found", 404);
    }
}

// XOR-based decryption (matches your xorEncrypt logic)
function xorDecrypt(encryptedBase64: string, key: string = "testkey123"): string {
    // Decode from base64
    const encrypted = atob(encryptedBase64);
    let result = '';
    for (let i = 0; i < encrypted.length; i++) {
        result += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}
