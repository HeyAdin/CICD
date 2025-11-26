"use server"

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export const createOnRampTransaction = async (provider: string, amount: number) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return {
            message: "unauthenticated request"
        }
    }
    const transactionStatus = await prisma.onRampTransaction.create({
        data: {
            status: "Processing",
            token: "token_" + ((Math.random() * 100000).toFixed(0)),
            provider,
            amount,
            userId: Number(session.user.id),
            startTime: new Date()
        }
    });

    return {
        message: "On Ramp Transaction added"
    }
}