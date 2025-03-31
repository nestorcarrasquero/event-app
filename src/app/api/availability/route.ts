import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const availability = await prisma.availability.findMany();
    return NextResponse.json(availability);
}