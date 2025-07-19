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