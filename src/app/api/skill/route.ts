import { prisma } from "@/app/utils/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const skill = await prisma.skill.findMany();
        return NextResponse.json(skill);
    } catch (error) {
        return NextResponse.json({
            data: null,
            message: `Some problem ${error}`,
            status: 500
        })
    }
}