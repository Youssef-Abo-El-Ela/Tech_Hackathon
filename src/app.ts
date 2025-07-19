import express from "express";
import router from "./routes";
import cors from "cors";
import { PrismaClient } from "./generated/prisma";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true,
}));

export const prisma = new PrismaClient();

app.use("/api", router)

export default app;