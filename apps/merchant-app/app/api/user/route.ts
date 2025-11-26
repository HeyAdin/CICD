import { NextResponse } from "next/server"
import prisma from "@repo/db/client";

const client = prisma;

export const GET = async () => {
    // avoid creating a user in a build step; keep this endpoint safe for build-time type checks
    // If you need to create users for dev/testing, ensure required fields (number, password) are provided.
    return NextResponse.json({
        message: "hi there"
    })
}