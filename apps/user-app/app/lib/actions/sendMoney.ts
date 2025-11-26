"use server"

import prisma from "@repo/db/client"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"

export async function SendMoney( to : string, amount:number ) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return { message: "unauthorized user" }
    }
    const numberExists = await prisma.user.findUnique({
        where: {
            number:to
        }
    })
    if (!numberExists) {
        return { message: "number doesn't exists" };
    }

    await prisma.$transaction(async (tx) => {
        const fromBalance = await tx.balance.findUnique({ where: { userId: Number(from) } });
        if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient fund');
        }
        await new Promise((resolve)=>{
            setTimeout(resolve,3000);
        });
        await tx.balance.update({
            where: { userId: Number(from) },
            data: {
                amount: {
                    decrement: amount
                }
            }
        });
        await tx.balance.update({
            where: { userId: numberExists.id },
            data: {
                amount: {
                    increment: amount
                }
            }
        })
    });
}