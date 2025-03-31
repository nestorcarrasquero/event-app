import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const role = await prisma.role.findMany();
    return NextResponse.json(role);
}