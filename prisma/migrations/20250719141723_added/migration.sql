-- AlterTable
ALTER TABLE "beneficiaries" ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL,
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "location_updated_at" DROP NOT NULL,
ALTER COLUMN "alert_time" DROP NOT NULL;
