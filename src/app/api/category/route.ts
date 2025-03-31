import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
}