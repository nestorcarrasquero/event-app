import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const skill = await prisma.skill.findMany();
    return NextResponse.json(skill);
}